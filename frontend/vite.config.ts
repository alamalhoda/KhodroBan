import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

const isStaticPages = process.env.STATIC_PAGES === 'true';
const basePath = process.env.BASE_PATH || (isStaticPages ? '/KhodroBan/' : '/');

export default defineConfig({
  plugins: [sveltekit()],
  base: basePath,
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      $components: path.resolve('./src/lib/components'),
      $stores: path.resolve('./src/lib/stores'),
      $services: path.resolve('./src/lib/services'),
      $utils: path.resolve('./src/lib/utils'),
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
