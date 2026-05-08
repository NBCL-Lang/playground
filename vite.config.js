import { defineConfig } from 'vite';

export default defineConfig({
  base: '/playground/', 
  
  build: {
    target: 'esnext'
  }
});