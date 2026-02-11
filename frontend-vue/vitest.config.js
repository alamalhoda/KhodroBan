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
      // آستانه‌ها اختیاری؛ برای اجباری کردن پوشش، مقادیر را تنظیم کنید (مثلاً 70)
      threshold: {
        global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0
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
      // Resolve from frontend-vue node_modules when shared/* is loaded (CI)
      axios: path.resolve(__dirname, 'node_modules/axios'),
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
    },
  },
})
