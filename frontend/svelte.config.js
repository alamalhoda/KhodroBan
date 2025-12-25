import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterDeno from '@deno/svelte-adapter';
import adapterNetlify from '@sveltejs/adapter-netlify';
import adapterStatic from '@sveltejs/adapter-static';


/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true,
  },
  kit: {
    paths: {
      base: process.env.STATIC_PAGES === 'true' ? `/${process.env.REPO_NAME || 'KhodroBan'}` : ''
    },
    adapter: (() => {
      // در محیط‌های بدون process (مثل بعضی buildهای قدیمی) ایمن باش
      if (typeof process === 'undefined') {
        return adapterStatic({
          pages: 'build',
          assets: 'build',
          fallback: 'index.html',
          precompress: false
        });
      }
       // حالت مخصوص GitHub Pages → خروجی کاملاً استاتیک
      if (process.env.STATIC_PAGES === 'true') {
        return adapterStatic({
          pages: 'build',
          assets: 'build',
          fallback: 'index.html',
          precompress: false
        });
      }
      // Deno Deploy: از متغیر DEPLOY_PLATFORM برای تشخیص استفاده می‌کنیم
      if (process.env.DEPLOY_PLATFORM === 'deno') {
        return adapterDeno();
      }

      // Netlify: متغیر NETLIFY=true همیشه در build و runtime وجود داره
      if (process.env.NETLIFY) {
        return adapterNetlify({
          // SPA fallback برای client-side routing
          edge: false,
          split: false
        });
      }

      // Development & Production: کاملاً SPA با adapterStatic
      return adapterStatic({
        pages: 'build',
        assets: 'build',
        fallback: 'index.html',
        precompress: false
      });
    })()
  },
};

export default config;
