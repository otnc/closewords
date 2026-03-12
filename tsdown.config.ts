import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/worker.ts'],
  format: ['cjs'],
  dts: true,
  outDir: 'dist',
  platform: 'node',
  clean: true,
});
