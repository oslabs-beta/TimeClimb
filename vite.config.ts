/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Replace with your Express server port
        changeOrigin: true,
      },
    },
  },
  test: {
    include: ['./test/test.jsx'],
    environment: 'jsdom',
    globals: true,
    css: true,
    // setupFiles: ['./setupTests.js'],
    // setupFiles: "./test/test.ts"
  },
});
