import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    host: '0.0.0.0',
    strictPort: true,

    // hmr: false,
    hmr: {
      clientPort: 8000,
    },
    watch: {
      usePolling: true
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/theme/_fonts.scss"; @import "@/assets/theme/_grid.scss"; @import "@/assets/theme/_theme.scss";  @import "@/assets/theme/_variables.scss";`
      }
    }
  },
})
