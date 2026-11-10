import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages(/ABBook/) 배포 시 워크플로에서 BASE_PATH 지정, 그 외는 루트
  base: process.env.BASE_PATH ?? '/',
})
