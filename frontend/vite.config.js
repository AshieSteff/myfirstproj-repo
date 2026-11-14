import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, forward /api requests to the Express server on port 5000,
// so the frontend code can use the same relative URLs in dev and production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
