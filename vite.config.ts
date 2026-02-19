import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { wasp } from 'wasp/client/vite'

export default defineConfig({
  plugins: [wasp(), tailwindcss()],
  server: {
    open: true,
    allowedHosts: ['crystal-jade-panther-ihkr.sprites.app'],
    proxy: {
      '/auth': 'http://localhost:3001',
      '/operations': 'http://localhost:3001',
      '/jobs': 'http://localhost:3001',
    },
  },
})
