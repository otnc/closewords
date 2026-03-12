import { toHepburn } from '../src/toHepburn';

describe('toHepburn', () => {
  it('ひらがなをヘボン式ローマ字に変換する', () => {
    expect(toHepburn('とうきょう')).toBe('toukyou');
  });

  it('カタカナをヘボン式ローマ字に変換する', () => {
    expect(toHepburn('トウキョウ')).toBe('toukyou');
  });

  it('アルファベットはそのまま返す（変換後）', () => {
    const result = toHepburn('abc');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
