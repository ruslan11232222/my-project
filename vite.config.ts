import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  envDir: '..',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
  build: { outDir: '../dist', emptyOutDir: true, sourcemap: true },
});