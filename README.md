# closewords

A library for finding the most similar word from a list of words, supporting Japanese (including kanji).

> **Note:** It may be a little slow because it uses morphological analysis. By adopting `worker_threads`, the processing speed is slightly improved compared to the standard.

日本語のドキュメントは [README-ja.md](README-ja.md) を参照してください。

## Installation

```sh
npm install closewords
```

## Usage

### `closeWords(word, candidates, raw?)`

| Parameter    | Type                                              | Default | Description                          |
| ------------ | ------------------------------------------------- | ------- | ------------------------------------ |
| `word`       | `string \| { word: string; pronounce?: string }`  | —       | The reference word or object.        |
| `candidates` | `Array<string \| { word: string; pronounce?: string }>` | — | List of candidate words or objects.  |
| `raw`        | `boolean`                                         | `false` | Whether to include similarity scores.|

**Returns:** `Promise<string[]>` when `raw` is `false`, `Promise<Array<{ word: string; score: number }>>` when `raw` is `true`.

The highest score is `1` (perfect match), the lowest is `0`.

The optional `pronounce` field accepts **alphabetic strings only** and is used as a pronunciation hint for morphological analysis.

### Example

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

## Change Log

### 2.3.1 --> 3.0.0
Rewrote in TypeScript. Introduced `tsdown` for bundling.  
Moved source files to `src/`. Separated README into English / Japanese.

### 2.2.0 --> 2.3.0
Improved Hepburn-style completion. Format code.

### 2.1.4 --> 2.2.0
`word.pronounce` and `pronounce` in `candidates[]` are completed Hepburn-style.

### 2.1.3 --> 2.1.4
Fixed bugs.

### 2.1.2 --> 2.1.3
Fixed score calculation.

### 2.1.1 --> 2.1.2
Fixed score calculation.

### 2.1.0 --> 2.1.1
Fixed `README`. Fixed the issue that only a string could be specified in `word`. Fixed the issue that `word.pronounce` was ignored. Fixed the issue that non-alphabet could be specified for `word.pronounce` and `pronounce` in `candidates[]`. `word.pronounce` and `pronounce` in `candidates[]` are now optional. Fixed a few other bugs.

### 2.0.0 --> 2.1.0
Added a way to specify the pronunciation of words.

### 1.0.2 --> 2.0.0
Introduced `fast-levenshtein` and fixed score calculation. The similarity of the original strings is also evaluated.

### 1.0.1 --> 1.0.2
Introduced `jaro-winkler` and optimized.

### 1.0.0 --> 1.0.1
Fixed score calculation.

### 0.x --> 1.0.0
Package released! Introducing morphological analysis.
