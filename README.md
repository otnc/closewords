# closewords

A library for finding the most similar word from a list of words, supporting Japanese (including kanji).

> [!Note]  
> It may be a little slow because it uses morphological analysis. By adopting `worker_threads`, the processing speed is slightly improved compared to the standard.

日本語のドキュメントは [README-ja.md](README-ja.md) を参照してください。

## Installation

```sh
npm install closewords
```

## Usage

### `closeWords(word, candidates, raw?)`

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `word` | `string \| { word: string; pronounce?: string }` | — | The reference word or object. |
| `candidates` | `Array<string \| { word: string; pronounce?: string }>` | — | List of candidate words or objects. |
| `raw` | `boolean` | `false` | Whether to include similarity scores. |

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

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

## License

[ISC License](LICENSE)
