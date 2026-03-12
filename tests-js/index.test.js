'use strict';

const { closeWords } = require('../dist/index.cjs');

// kuromoji の初期化があるため長めに設定
jest.setTimeout(30_000);

describe('[build] closeWords — 基本動作', () => {
  test('完全一致の候補が最高スコアになる', async () => {
    const word = '東京';
    const candidates = ['東京', 'とっこう', '東きょう', 'とう京', 'とうきょう', 'とーきょー'];
    const result = await closeWords(word, candidates);
    expect(result).toEqual(['東京']);
  });

  test('raw:true でスコア付き配列を返す', async () => {
    const word = '東京';
    const candidates = ['東京', 'とうきょう'];
    const result = await closeWords(word, candidates, true);
    expect(result).toHaveLength(2);
    expect(result[0].word).toBe('東京');
    expect(result[0].score).toBeCloseTo(1, 1);
    // スコアは降順
    expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
  });

  test('英単語の類似度を判定できる', async () => {
    const result = await closeWords('color', ['colour', 'colon', 'floor']);
    expect(result[0]).toBe('colour');
  });

  test('複数候補が同スコアのとき全て返す', async () => {
    const result = await closeWords('abc', ['abc', 'abc']);
    expect(result).toHaveLength(2);
  });
});

describe('[build] closeWords — pronounce オプション', () => {
  test('word に pronounce を指定できる', async () => {
    const word = { word: '東京', pronounce: 'tokyo' };
    const candidates = [
      { word: 'とうきょう', pronounce: 'toukyou' },
      { word: '大阪', pronounce: 'osaka' },
    ];
    const result = await closeWords(word, candidates, true);
    expect(result).toHaveLength(2);
    expect(result[0].word).toBe('とうきょう');
  });

  test('candidates に pronounce を指定できる', async () => {
    const result = await closeWords('とうきょう', [
      { word: '東京', pronounce: 'toukyou' },
      { word: '大阪', pronounce: 'osaka' },
    ]);
    expect(result[0]).toBe('東京');
  });
});

describe('[build] closeWords — バリデーション', () => {
  test('word が不正な値の場合はエラー', async () => {
    await expect(closeWords(123, ['test'])).rejects.toThrow();
  });

  test('candidates が配列でない場合はエラー', async () => {
    await expect(closeWords('test', 'not-array')).rejects.toThrow();
  });

  test('word.pronounce にアルファベット以外を指定するとエラー', async () => {
    await expect(
      closeWords({ word: '東京', pronounce: '東京' }, ['候補'])
    ).rejects.toThrow(/alphabetic/);
  });

  test('candidates[].pronounce にアルファベット以外を指定するとエラー', async () => {
    await expect(
      closeWords('test', [{ word: '候補', pronounce: '漢字' }])
    ).rejects.toThrow(/alphabetic/);
  });

  test('raw が boolean でない場合はエラー', async () => {
    await expect(closeWords('test', ['test'], 'yes')).rejects.toThrow(/boolean/);
  });
});
