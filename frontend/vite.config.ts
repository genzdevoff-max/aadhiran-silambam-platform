import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import path from 'node:path';

const publicRoot = path.resolve(process.cwd(), 'public');
const backendTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
      },
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
        bypass: (request) => {
          const requestPath = (request.url || '').split('?')[0];
          const localAssetPath = path.resolve(publicRoot, `.${requestPath}`);
          if (
            localAssetPath.startsWith(`${publicRoot}${path.sep}`) &&
            existsSync(localAssetPath)
          ) {
            return requestPath;
          }
        },
      },
    },
  },
});
