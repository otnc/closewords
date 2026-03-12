/**
 * An alphabetic string type (accepts only A-Z, a-z, and hyphens).
 * アルファベット文字列型（A-Z, a-z, ハイフンのみ許容）
 */
export type AlphabeticString = string & { __alphabeticBrand?: never };

/**
 * A candidate object with an optional pronounce property.
 * pronounce は任意で、アルファベット文字列のみを受け入れます。
 */
export interface Candidate {
  /** Candidate word. / 候補単語 */
  word: string;
  /** Optional alphabetic pronunciation hint. / 任意のアルファベット読み仮名 */
  pronounce?: AlphabeticString;
}

/**
 * The result of a similarity comparison.
 * 類似度比較の結果を表します。
 */
export interface CloseWordsResult {
  /** Candidate word. / 候補単語 */
  word: string;
  /** Similarity score (0–1). / 類似度スコア（0〜1） */
  score: number;
}
