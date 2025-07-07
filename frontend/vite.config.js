import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://wisewheelapp-staging.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Forward cookies
            proxyReq.setHeader('x-forwarded-proto', 'https');
          });
        }
      },
      '/auth': {
        target: 'https://wisewheelapp-staging.up.railway.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
