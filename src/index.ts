import jaroWinkler from 'jaro-winkler';
import * as levenshtein from 'fast-levenshtein';
import { Worker } from 'worker_threads';
import path from 'path';
import { isAlphabetOnly } from './isAlphabetOnly';
import type { Candidate, CloseWordsResult } from './types';

export type { Candidate, CloseWordsResult, AlphabeticString } from './types';

type WordInput = string | Candidate;

// ---------------------------------------------------------------------------
// Persistent worker — kuromoji の辞書を初回のみ読み込み、以降は再利用する
// ---------------------------------------------------------------------------

let workerInstance: Worker | null = null;
let requestId = 0;
const pending = new Map<
  number,
  { resolve: (v: string[]) => void; reject: (e: Error) => void }
>();

function getWorker(): Worker {
  if (workerInstance) return workerInstance;

  const isTs = __filename?.endsWith('.ts') ?? false;
  const workerFile = isTs
    ? path.resolve(__dirname, './worker.ts')
    : path.resolve(__dirname, './worker.cjs');
  const execArgv = isTs ? ['--require', 'tsx/cjs'] : [];

  const w = new Worker(workerFile, { execArgv });

  w.on(
    'message',
    (msg: { id: number; results?: string[]; error?: string }) => {
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(msg.error));
      else p.resolve(msg.results!);
    }
  );

  w.on('error', (err) => {
    for (const p of pending.values()) p.reject(err as Error);
    pending.clear();
    workerInstance = null;
  });

  w.on('exit', () => {
    for (const p of pending.values())
      p.reject(new Error('Worker exited unexpectedly'));
    pending.clear();
    workerInstance = null;
  });

  // プロセス終了を妨げない
  w.unref();
  workerInstance = w;
  return w;
}

function convertToRomaji(
  words: WordInput[],
  dicPath: string
): Promise<string[]> {
  const worker = getWorker();
  const id = ++requestId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, words, dicPath });
  });
}

/**
 * Finds the closest strings in an array to the given word.
 * 与えられた単語に最も近い単語を候補リストから探します。
 *
 * @param word  - The reference word or object. / 比較対象の単語またはオブジェクト
 * @param candidates - Candidate words or objects. / 候補リスト
 * @param raw - Whether to include similarity scores (default: false). / 類似度スコアを含むか
 * @returns The closest word(s) or detailed scores. / 最も類似した単語または詳細なスコア
 */
export async function closeWords(
  word: WordInput,
  candidates: WordInput[],
  raw?: false
): Promise<string[]>;
export async function closeWords(
  word: WordInput,
  candidates: WordInput[],
  raw: true
): Promise<CloseWordsResult[]>;
export async function closeWords(
  word: WordInput,
  candidates: WordInput[],
  raw = false
): Promise<string[] | CloseWordsResult[]> {
  if (typeof word !== 'string' && (typeof word !== 'object' || !word.word)) {
    throw new Error("word must be a string or an object with 'word'.");
  }

  if (
    typeof word === 'object' &&
    word.pronounce &&
    !isAlphabetOnly(word.pronounce)
  ) {
    throw new Error('word.pronounce must be an alphabetic string.');
  }

  if (
    !Array.isArray(candidates) ||
    !candidates.every(
      (item) =>
        typeof item === 'string' || (typeof item === 'object' && item.word)
    )
  ) {
    throw new Error(
      "Candidates must be an array of strings or objects with 'word'."
    );
  }

  if (
    !candidates
      .filter((c): c is Candidate => typeof c === 'object' && !!c.pronounce)
      .every((item) => isAlphabetOnly(item.pronounce!))
  ) {
    throw new Error('pronounces within candidates must be alphabetic strings.');
  }

  if (typeof raw !== 'boolean') throw new Error('raw must be boolean.');

  const dicPath = path.resolve(__dirname, './dict');
  const romajiWords = await convertToRomaji([word, ...candidates], dicPath);

  const romajiWord = romajiWords[0];
  const romajiCandidates = romajiWords.slice(1);

  const searchWord = typeof word === 'string' ? word : word.word;
  const baseLength = searchWord.length;
  // 配列化・Set 化を1回だけ行う
  const searchChars = Array.from(searchWord);
  const searchCharSet = new Set(searchChars);

  const scores: CloseWordsResult[] = candidates.map((candidate, index) => {
    const candidateWord =
      typeof candidate === 'string' ? candidate : candidate.word;

    // 完全一致は即座に 1.0 を返す
    if (searchWord === candidateWord) {
      return { word: candidateWord, score: 1 };
    }

    const candidateLength = candidateWord.length;
    const maxLen = Math.max(baseLength, candidateLength);

    // ローマ字の音韻的類似度 (Jaro-Winkler)
    const romajiScore = jaroWinkler(romajiWord, romajiCandidates[index]);

    // 元文字列のレーベンシュタイン類似度
    const stringScore =
      1 - levenshtein.get(searchWord, candidateWord) / maxLen;

    // 先頭一致の文字数
    const candidateChars = Array.from(candidateWord);
    let prefixMatch = 0;
    const minLen = Math.min(searchChars.length, candidateChars.length);
    for (let i = 0; i < minLen; i++) {
      if (searchChars[i] === candidateChars[i]) prefixMatch++;
      else break;
    }
    const prefixRatio = prefixMatch / maxLen;

    // 文字の包含率 (Set で O(1) ルックアップ)
    let charMatchCount = 0;
    for (const ch of searchChars) {
      if (candidateWord.includes(ch)) charMatchCount++;
    }
    const charRatio = charMatchCount / maxLen;

    // 完全一致ボーナス (文字包含率ベース)
    const exactCharBonus = charRatio * 0.4;

    // 長さペナルティ
    const lengthPenalty = Math.max(
      0.7,
      1 - Math.abs(baseLength - candidateLength) / baseLength
    );

    // 先頭一致ボーナス
    const prefixBonus = prefixRatio > 0 ? prefixRatio * 0.05 : 0;

    // スコア算出
    const combinedScore =
      (romajiScore * 0.7 + stringScore * 0.2 + charRatio * 0.1) *
        lengthPenalty +
      exactCharBonus +
      prefixBonus;

    return { word: candidateWord, score: Math.min(combinedScore, 1) };
  });

  scores.sort((a, b) => b.score - a.score);

  if (!raw) {
    const maxScore = scores[0]?.score;
    return scores
      .filter((item) => item.score === maxScore)
      .map((item) => item.word);
  }

  return scores;
}
