import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'build',  // change this from 'dist' to 'build'
    emptyOutDir: true,
  }
});
