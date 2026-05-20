# Changelog

日本語の変更履歴は [CHANGELOG-ja.md](CHANGELOG-ja.md) を参照してください。

## [3.1.0]

Support ESM import. Added dual CJS/ESM build output via `tsdown`.
Switched to `@types/jaro-winkler` and removed the internal type declaration.

## [3.0.0]

Rewrote in TypeScript. Introduced `tsdown` for bundling.
Moved source files to `src/`. Separated README into English / Japanese.

## [2.3.0]

Improved Hepburn-style completion. Format code.

## [2.2.0]

`word.pronounce` and `pronounce` in `candidates[]` are completed Hepburn-style.

## [2.1.4]

Fixed bugs.

## [2.1.3]

Fixed score calculation.

## [2.1.2]

Fixed score calculation.

## [2.1.1]

Fixed `README`. Fixed the issue that only a string could be specified in `word`. Fixed the issue that `word.pronounce` was ignored. Fixed the issue that non-alphabet could be specified for `word.pronounce` and `pronounce` in `candidates[]`. `word.pronounce` and `pronounce` in `candidates[]` are now optional. Fixed a few other bugs.

## [2.1.0]

Added a way to specify the pronunciation of words.

## [2.0.0]

Introduced `fast-levenshtein` and fixed score calculation. The similarity of the original strings is also evaluated.

## [1.0.2]

Introduced `jaro-winkler` and optimized.

## [1.0.1]

Fixed score calculation.

## [1.0.0]

Package released! Introducing morphological analysis.
