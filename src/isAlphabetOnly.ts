export function isAlphabetOnly(str: string): boolean {
  return /^[A-Za-z-]+$/.test(str);
}
