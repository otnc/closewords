# closewords

最も似た単語を単語群から検索する日本語（漢字含む）対応のライブラリです。

> **注意:** 形態素解析を利用しているため、多少遅い可能性があります。`worker_threads` を採用しているため、標準より少しは処理速度が改善されています。

English documentation: [README.md](README.md)

## インストール

```sh
npm install closewords
```

## 使い方

### `closeWords(word, candidates, raw?)`

| パラメータ    | 型                                                       | デフォルト | 説明                            |
| ------------ | -------------------------------------------------------- | ---------- | ------------------------------- |
| `word`       | `string \| { word: string; pronounce?: string }`         | —          | 比較対象の単語またはオブジェクト |
| `candidates` | `Array<string \| { word: string; pronounce?: string }>` | —          | 候補単語のリスト                 |
| `raw`        | `boolean`                                                | `false`    | 類似度スコアを含めるか           |

**戻り値:** `raw` が `false` のとき `Promise<string[]>`、`true` のとき `Promise<Array<{ word: string; score: number }>>` を返します。

スコアの最高値は `1`（完全一致）、最低値は `0` です。

任意の `pronounce` フィールドは **アルファベット文字列のみ** を受け入れ、形態素解析の読み仮名ヒントとして使用されます。

### 例

```ts
import { closeWords } from 'closewords';

const word = '東京';
const candidates = ['東京', 'とっこう', '東きょう', 'とう京', 'とうきょう', 'とーきょー'];

const result = await closeWords(word, candidates);
console.log(result);
// => [ '東京' ]

const resultWithScores = await closeWords(word, candidates, true);
console.log(resultWithScores);
// => [
//   { word: '東京', score: 1 },
//   { word: 'とう京', score: 0.693... },
//   ...
// ]
```

## 変更履歴

### 2.3.1 --> 3.0.0
TypeScript で書き直しました。`tsdown` によるバンドルを導入しました。  
ソースファイルを `src/` に集約しました。README を英語版・日本語版に分離しました。

### 2.2.0 --> 2.3.0
ヘボン式補完を改善しました。コードをフォーマットしました。

### 2.1.4 --> 2.2.0
`word.pronounce` と `candidates[]` 内の `pronounce` をヘボン式で補完するようにしました。

### 2.1.3 --> 2.1.4
バグを修正しました。

### 2.1.2 --> 2.1.3
スコア計算方法を修正しました。

### 2.1.1 --> 2.1.2
スコア計算方法を修正しました。

### 2.1.0 --> 2.1.1
`README` を修正しました。`word` に文字列以外指定できない問題を修正しました。`word.pronounce` が無視される問題を修正しました。`word.pronounce` と `candidates[]` 内の `pronounce` にアルファベット以外を指定できる問題を修正しました。`word.pronounce` と `candidates[]` 内の `pronounce` を任意にしました。その他数件のバグを修正しました。

### 2.0.0 --> 2.1.0
単語の発音を指定する方法を追加しました。

### 1.0.2 --> 2.0.0
`fast-levenshtein` を導入し、スコア計算方法を修正しました。元の文字列の一致度も評価されるようになりました。

### 1.0.1 --> 1.0.2
`jaro-winkler` を導入し、最適化しました。

### 1.0.0 --> 1.0.1
スコア計算方法を修正しました。

### 0.x --> 1.0.0
パッケージをリリース！ 形態素解析を導入しました。
