import { toHepburn } from '../src/toHepburn';

describe('toHepburn', () => {
  it('ひらがなをヘボン式ローマ字に変換する', () => {
    expect(toHepburn('とうきょう')).toBe('toukyou');
  });

  it('カタカナをヘボン式ローマ字に変換する', () => {
    expect(toHepburn('トウキョウ')).toBe('toukyou');
  });

  it('拗音を変換する', () => {
    expect(toHepburn('きょうと')).toBe('kyouto');
  });

  it('濁音・半濁音を変換する', () => {
    expect(toHepburn('ぎゅうにゅう')).toBe('gyuunyuu');
    expect(toHepburn('ぱぴぷぺぽ')).toBe('papipupepo');
  });

  it('長音を変換する', () => {
    expect(toHepburn('おおさか')).toBe('oosaka');
  });

  it('アルファベット文字列でも文字列を返す', () => {
    const result = toHepburn('abc');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
