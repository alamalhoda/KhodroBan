import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const isStaticPages = process.env.STATIC_PAGES === 'true';

export default defineConfig({
  plugins: [sveltekit()],
  base: isStaticPages ? '/KhodroBan/' : '/',
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup-tests.ts'],
  },
});
