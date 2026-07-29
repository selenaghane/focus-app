import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Served from a repo subpath on GitHub Pages, so assets need that prefix.
  // Dev keeps '/' so localhost is unaffected.
  base: process.env.NODE_ENV === 'production' ? '/focus-app/' : '/',
})
