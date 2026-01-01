import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@services': path.resolve(__dirname, '../shared/services'),
      '@types': path.resolve(__dirname, '../shared/types'),
      '@utils': path.resolve(__dirname, '../shared/utils'),
    },
  },
  server: {
    port: 5174, // Different port from SvelteKit (5173)
  },
  build: {
    outDir: 'dist',
    // SPA mode - no SSR
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      'axios',
      '@google/genai',
      'openai',
      'persian-date',
    ],
  },
})
