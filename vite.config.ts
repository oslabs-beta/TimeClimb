// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { stopCoverage } from 'v8';
import { report } from 'process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Replace with your Express server port
        changeOrigin: true,
      },
    },
  },
  test: {
    coverage: { include: ['src/**/*.{tsx,ts}'] },
    stopCoverage: {
      reportsDirectory: './src',
      report: ['text', 'html']
    },
    include: ['./__test__/**.tsx'],
    environment: 'jsdom',
    globals: true,
    css: true,
    // setupFiles: ['./setupTests.js'],
    // setupFiles: "./test/test.ts"
  },
});
