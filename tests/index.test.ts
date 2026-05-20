import { closeWords } from '../src/index';

// Worker スレッドが ts ソースを tsx/cjs で実行するため、ネットワーク・ファイルI/Oが
// 発生します。タイムアウトを長めに設定します。
jest.setTimeout(30_000);

describe('closeWords — 基本動作', () => {
  it('完全一致の候補が最高スコアになる', async () => {
    const result = await closeWords('東京', ['東京', 'とっこう', '東きょう', 'とう京', 'とうきょう', 'とーきょー']);
    expect(result).toEqual(['東京']);
  });

  it('raw: true でスコア付き配列を返す', async () => {
    const result = await closeWords('東京', ['東京', 'とうきょう'], true);
    expect(result).toHaveLength(2);
    expect(result[0].word).toBe('東京');
    expect(result[0].score).toBeCloseTo(1, 1);
  });

  it('raw: true でスコアが降順になっている', async () => {
    const result = await closeWords('東京', ['大阪', '東京', 'とうきょう'], true);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
    }
  });

  it('英単語の類似度を判定できる', async () => {
    const result = await closeWords('color', ['colour', 'colon', 'floor']);
    expect(result[0]).toBe('colour');
  });

  it('複数候補が同スコアのとき全て返す', async () => {
    const result = await closeWords('abc', ['abc', 'abc']);
    expect(result).toHaveLength(2);
  });

  it('candidates が空配列のとき空配列を返す', async () => {
    const result = await closeWords('東京', []);
    expect(result).toEqual([]);
  });
});

describe('closeWords — pronounce オプション', () => {
  it('word に pronounce を指定できる', async () => {
    const word = { word: '東京', pronounce: 'tokyo' };
    const candidates = [
      { word: 'とうきょう', pronounce: 'toukyou' },
      { word: '大阪', pronounce: 'osaka' },
    ];
    const result = await closeWords(word, candidates, true);
    expect(result).toHaveLength(2);
    expect(result[0].word).toBe('とうきょう');
  });

  it('candidates に pronounce を指定できる', async () => {
    const result = await closeWords('とうきょう', [
      { word: '東京', pronounce: 'toukyou' },
      { word: '大阪', pronounce: 'osaka' },
    ]);
    expect(result[0]).toBe('東京');
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

  it('word.pronounce にアルファベット以外を指定するとエラー', async () => {
    await expect(
      closeWords({ word: '東京', pronounce: '東京' as never }, ['候補'])
    ).rejects.toThrow('alphabetic');
  });

  it('candidates[].pronounce にアルファベット以外を指定するとエラー', async () => {
    await expect(
      closeWords('test', [{ word: '候補', pronounce: '漢字' as never }])
    ).rejects.toThrow('alphabetic');
  });

  it('raw が boolean でない場合はエラー', async () => {
    // @ts-expect-error テスト用: 不正な型を渡す
    await expect(closeWords('test', ['test'], 'yes')).rejects.toThrow('boolean');
  });
});
