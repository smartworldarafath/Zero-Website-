import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/pollinations': {
          target: 'https://text.pollinations.ai',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/pollinations/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
              proxyReq.removeHeader('Origin');
              proxyReq.removeHeader('Referer');
            });
          }
        },
        '/proxy/arbian-enterprise': {
          target: 'https://arbian-enterprise.vercel.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/arbian-enterprise\/?/, '/'),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        },
        '/proxy/international-education': {
          target: 'https://international-education-consultancy.vercel.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/international-education\/?/, '/'),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        },
        '/proxy/local-drive-official': {
          target: 'https://local-drive-official-web.netlify.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/local-drive-official\/?/, '/'),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        },
        '/proxy/local-drive': {
          target: 'https://local-drive.vercel.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/local-drive\/?/, '/'),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        },
        '/proxy/0zerostudioai': {
          target: 'https://0zerostudioai.netlify.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/0zerostudioai\/?/, '/'),
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        }
      }
    },
  };
});
