import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: 'inline',
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'react-card.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[hash].[ext]',
      },
    },
    watch: {
      include: 'src/**/*.tsx',
    },
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    cors: true,
  },
});
