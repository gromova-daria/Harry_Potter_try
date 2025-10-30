import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Harry_Potter/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        characters: './characters.html',
        filmography: './filmography.html',
        houses: './houses.html'
      }
    }
  },
  server: {
    port: 3000
  }
});
