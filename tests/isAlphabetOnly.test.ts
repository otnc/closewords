import { isAlphabetOnly } from '../src/isAlphabetOnly';

describe('isAlphabetOnly', () => {
  it('アルファベットのみの文字列は true', () => {
    expect(isAlphabetOnly('hello')).toBe(true);
    expect(isAlphabetOnly('Tokyo')).toBe(true);
    expect(isAlphabetOnly('a')).toBe(true);
  });

  it('ハイフンを含む文字列は true', () => {
    expect(isAlphabetOnly('abc-def')).toBe(true);
    expect(isAlphabetOnly('tou-kyou')).toBe(true);
  });

  it('アルファベット以外が含まれる場合は false', () => {
    expect(isAlphabetOnly('tokyo1')).toBe(false);
    expect(isAlphabetOnly('東京')).toBe(false);
    expect(isAlphabetOnly('hello world')).toBe(false);
    expect(isAlphabetOnly('abc!')).toBe(false);
  });

  it('空文字列は false', () => {
    expect(isAlphabetOnly('')).toBe(false);
  });
});
