import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the Express backend during development
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    target: 'es2022',
  },
})
