import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'app.js',
      output: {
        entryFileNames: 'app.js',
        inlineDynamicImports: true,
        manualChunks: undefined
      },
    },
  },
});
