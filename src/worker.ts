import { parentPort, workerData } from 'worker_threads';
import kuromoji from 'kuromoji';
import { toRomaji } from 'wanakana';
import { isAlphabetOnly } from './isAlphabetOnly';
import { toHepburn } from './toHepburn';
import type { Candidate } from './types';

type WordInput = string | Candidate;

interface WorkerMessage {
  id: number;
  words: WordInput[];
  dicPath: string;
}

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

function initializeTokenizer(
  dicPath: string
): Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> {
  if (tokenizer) return Promise.resolve(tokenizer);

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath }).build((err, builtTokenizer) => {
      if (err) return reject(new Error('Failed to initialize tokenizer: ' + err));
      tokenizer = builtTokenizer;
      resolve(builtTokenizer);
    });
  });
}

function toRomajiWord(
  tok: kuromoji.Tokenizer<kuromoji.IpadicFeatures>,
  word: WordInput
): string {
  const isWordObject = typeof word === 'object';
  if (isWordObject && word.pronounce) return toHepburn(word.pronounce);
  const targetWord = isWordObject ? word.word : word;
  if (isAlphabetOnly(targetWord)) return targetWord.toLowerCase();
  const tokens = tok.tokenize(targetWord);
  const hiragana = tokens
    .map((token) => token.reading ?? token.surface_form)
    .join('');
  return toRomaji(hiragana);
}

// legacy: one-shot via workerData
if (workerData) {
  const { words, dicPath } = workerData as { words: WordInput[]; dicPath: string };
  (async () => {
    try {
      const tok = await initializeTokenizer(dicPath);
      parentPort!.postMessage(words.map((w) => toRomajiWord(tok, w)));
    } catch (err) {
      parentPort!.postMessage({ error: String(err) });
    }
  })();
}

// persistent mode: listen for messages
parentPort!.on('message', async (msg: WorkerMessage) => {
  try {
    const tok = await initializeTokenizer(msg.dicPath);
    const results = msg.words.map((w) => toRomajiWord(tok, w));
    parentPort!.postMessage({ id: msg.id, results });
  } catch (err) {
    parentPort!.postMessage({ id: msg.id, error: String(err) });
  }
});
