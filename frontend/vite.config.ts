import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const isStaticPages = process.env.STATIC_PAGES === 'true';

export default defineConfig({
  plugins: [sveltekit()],
  base: isStaticPages ? '/KhodroBan/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
