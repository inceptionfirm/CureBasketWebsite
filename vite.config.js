import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev: same-origin /api → API host (avoids browser CORS when backend sends invalid duplicate ACAO headers).
const API_TARGET = 'https://api.curebasket.com'
const apiProxy = {
  '/api': {
    target: API_TARGET,
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, '') || '/',
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
