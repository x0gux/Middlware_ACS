import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react', // 👈 babel 속성 없이 이것만 유지
      }),
      Pages({
        dirs: 'src/pages',
      }) as any,
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL || env.Base_Url || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});