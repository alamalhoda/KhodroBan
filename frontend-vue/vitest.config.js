import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      include: ['src/**/*.js'],
      exclude: ['src/test/**', 'src/**/*.test.js', 'src/**/*.spec.js', 'src/main.js'],
      reporter: ['text', 'html'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@services': path.resolve(__dirname, '../shared/services'),
      '@types': path.resolve(__dirname, '../shared/types'),
      '@utils': path.resolve(__dirname, '../shared/utils'),
    },
  },
})