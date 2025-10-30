import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        characters: resolve(__dirname, 'characters.html'),
        filmography: resolve(__dirname, 'filmography.html'),
        houses: resolve(__dirname, 'houses.html')
      }
    }
  },
  server: {
    port: 3000
  }
})
