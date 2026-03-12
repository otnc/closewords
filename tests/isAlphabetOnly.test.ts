import { isAlphabetOnly } from '../src/isAlphabetOnly';

describe('isAlphabetOnly', () => {
  it('アルファベットのみの文字列は true', () => {
    expect(isAlphabetOnly('hello')).toBe(true);
    expect(isAlphabetOnly('Tokyo')).toBe(true);
    expect(isAlphabetOnly('abc-def')).toBe(true);
  });

  it('アルファベット以外が含まれる場合は false', () => {
    expect(isAlphabetOnly('tokyo1')).toBe(false);
    expect(isAlphabetOnly('東京')).toBe(false);
    expect(isAlphabetOnly('')).toBe(false);
    expect(isAlphabetOnly('hello world')).toBe(false);
  });
});
