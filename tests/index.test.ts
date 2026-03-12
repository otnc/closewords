import { closeWords } from '../src/index';

// Worker スレッドが ts ソースを tsx/cjs で実行するため、ネットワーク・ファイルI/Oが
// 発生します。タイムアウトを長めに設定します。
jest.setTimeout(30_000);

describe('closeWords — 基本動作', () => {
  it('完全一致の候補が最高スコアになる', async () => {
    const word = '東京';
    const candidates = ['東京', 'とっこう', '東きょう', 'とう京', 'とうきょう', 'とーきょー'];
    const result = await closeWords(word, candidates);
    expect(result).toEqual(['東京']);
  });

  it('raw: true でスコア付き配列を返す', async () => {
    const word = '東京';
    const candidates = ['東京', 'とうきょう'];
    const result = await closeWords(word, candidates, true);
    expect(result).toHaveLength(2);
    expect(result[0].word).toBe('東京');
    expect(result[0].score).toBeCloseTo(1, 1);
  });

  it('英単語の類似度を判定できる', async () => {
    const result = await closeWords('color', ['colour', 'colon', 'floor']);
    expect(result[0]).toBe('colour');
  });
});

describe('closeWords — pronounce オプション', () => {
  it('pronounce を指定した Candidate を処理できる', async () => {
    const word = { word: '東京', pronounce: 'tokyo' };
    const candidates = [
      { word: 'とうきょう', pronounce: 'toukyou' },
      { word: '大阪', pronounce: 'osaka' },
    ];
    const result = await closeWords(word, candidates, true);
    expect(result).toHaveLength(2);
    expect(result[0].word).toBe('とうきょう');
  });
});

describe('closeWords — バリデーション', () => {
  it('word が不正な値の場合はエラー', async () => {
    // @ts-expect-error テスト用: 不正な型を渡す
    await expect(closeWords(123, ['test'])).rejects.toThrow();
  });

  it('candidates が配列でない場合はエラー', async () => {
    // @ts-expect-error テスト用: 不正な型を渡す
    await expect(closeWords('test', 'not-an-array')).rejects.toThrow();
  });

  it('pronounce にアルファベット以外を指定するとエラー', async () => {
    await expect(
      closeWords({ word: '東京', pronounce: '東京' as never }, ['候補'])
    ).rejects.toThrow('alphabetic');
  });
});
