import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/worker.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  outDir: 'dist',
  platform: 'node',
  clean: true,
  shims: true,
});
