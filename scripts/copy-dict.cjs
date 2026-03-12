// @ts-check
const { cpSync } = require('fs');
const { join } = require('path');

const src = join(__dirname, '../src/dict');
const dest = join(__dirname, '../dist/dict');

cpSync(src, dest, { recursive: true });
console.log('Copied dict files: src/dict → dist/dict');
