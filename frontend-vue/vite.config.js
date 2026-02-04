import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

let VitePWA
try {
  const pwa = await import('vite-plugin-pwa')
  VitePWA = pwa.VitePWA
} catch {
  VitePWA = null
}

export default defineConfig({
  plugins: [
    vue(),
    ...(VitePWA ? [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'خودروبان - مدیریت سرویس خودرو',
        short_name: 'خودروبان',
        description: 'سیستم مدیریت سرویس و نگهداری خودرو',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['utilities', 'productivity'],
        lang: 'fa',
        dir: 'rtl'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Exclude large font files from precache (they're already local)
        globIgnores: ['**/fonts/**/*.woff2'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        runtimeCaching: [
          {
            // Cache font files at runtime instead
            urlPattern: /^https?:\/\/.*\/fonts\/.*\.woff2$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-static-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@services': path.resolve(__dirname, '../shared/services'),
      '@types': path.resolve(__dirname, '../shared/types'),
      '@utils': path.resolve(__dirname, '../shared/utils'),
    },
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: 'dist',
    // Enable minification (esbuild is faster than terser)
    minify: 'esbuild',
    // Code splitting and chunk optimization
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Vue core libraries (most critical)
            if (id.includes('vue') && !id.includes('vue-router') && !id.includes('pinia')) {
              return 'vendor-vue-core'
            }
            if (id.includes('vue-router')) {
              return 'vendor-vue-router'
            }
            if (id.includes('pinia')) {
              return 'vendor-pinia'
            }
            // i18n
            if (id.includes('vue-i18n')) {
              return 'vendor-i18n'
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'vendor-supabase'
            }
            // Other large dependencies
            if (id.includes('axios')) {
              return 'vendor-axios'
            }
            if (id.includes('openai')) {
              return 'vendor-openai'
            }
            // All other node_modules
            return 'vendor'
          }
          // Split large view files
          if (id.includes('/views/')) {
            const viewName = id.split('/views/')[1]?.split('.')[0]
            if (viewName && ['DashboardView', 'VehicleManagementView', 'SmartAssistantView'].includes(viewName)) {
              return `view-${viewName.toLowerCase()}`
            }
          }
          // Split composables
          if (id.includes('/composables/')) {
            return 'composables'
          }
          // Split stores
          if (id.includes('/stores/')) {
            return 'stores'
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].[ext]`
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].[ext]`
          }
          return `assets/${ext}/[name]-[hash].[ext]`
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000, // 1MB
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vue-i18n',
      '@supabase/supabase-js',
      'axios',
      'persian-date'
    ],
    exclude: [],
  },
})
