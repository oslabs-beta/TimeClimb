<<<<<<< HEAD
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
=======
/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
>>>>>>> 5fcdd4885ad5cbc6ca57266b8c05e5c92f756a7a

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Replace with your Express server port
        changeOrigin: true,
      },
    },
  },
});
=======
  test: {
    include: ["./test/test.jsx"],
    environment: 'jsdom', 
    globals: true,
    css: true,
    // setupFiles: ['./setupTests.js'],
    // setupFiles: "./test/test.ts"
  },
})


>>>>>>> 5fcdd4885ad5cbc6ca57266b8c05e5c92f756a7a
