import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        // Libraries change rarely, so keeping them in their own files lets the browser cache them
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) return 'react'
          if (/node_modules\/(@tanstack|axios)\//.test(id)) return 'data'
          if (id.includes('dompurify')) return 'sanitize'
          return undefined
        },
      },
    },
  },
})
