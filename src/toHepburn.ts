import { toRomaji, toHiragana } from 'wanakana';

export function toHepburn(str: string): string {
  return toRomaji(toHiragana(str));
}
