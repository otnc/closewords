# closewords

最も似た単語を単語群から検索する日本語（漢字含む）対応のライブラリです。

> [!Note]  
> 形態素解析を利用しているため、多少遅い可能性があります。`worker_threads` を採用しているため、標準より少しは処理速度が改善されています。

English documentation: [README.md](README.md)

## インストール

```sh
npm install closewords
```

## 使い方

### `closeWords(word, candidates, raw?)`

| パラメータ | 型 | デフォルト | 説明 |
| --- | --- | --- | --- |
| `word` | `string \| { word: string; pronounce?: string }` | — | 比較対象の単語またはオブジェクト |
| `candidates` | `Array<string \| { word: string; pronounce?: string }>` | — | 候補単語のリスト |
| `raw` | `boolean` | `false` | 類似度スコアを含めるか |

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

全バージョンの変更履歴は [CHANGELOG-ja.md](CHANGELOG-ja.md) を参照してください。

## ライセンス

[ISC License](LICENSE)
