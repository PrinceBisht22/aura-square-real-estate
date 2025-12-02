import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    host: true, // Listen on all addresses (0.0.0.0)
    strictPort: false,
  },
  preview: {
    port: 4173,
    host: true, // Listen on all addresses (0.0.0.0) for LAN access
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});

