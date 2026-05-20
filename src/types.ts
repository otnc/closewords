/**
 * An alphabetic string type (only A-Z, a-z, and hyphens are accepted).
 * アルファベット文字列型（A-Z, a-z, ハイフンのみ許容）
 */
export type AlphabeticString = string & { __alphabeticBrand?: never };

/**
 * A candidate object for similarity search.
 * 類似度検索の候補オブジェクト
 */
export interface Candidate {
  /** The candidate word. / 候補単語 */
  word: string;
  /** Optional pronunciation hint in alphabetic form. / 任意のアルファベット読み仮名 */
  pronounce?: AlphabeticString;
}

/**
 * The result of a similarity comparison.
 * 類似度比較の結果
 */
export interface CloseWordsResult {
  /** The candidate word. / 候補単語 */
  word: string;
  /** Similarity score from 0 to 1. / 類似度スコア（0〜1） */
  score: number;
}
