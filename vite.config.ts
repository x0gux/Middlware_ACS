import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig } from 'vite'
import Pages from "vite-plugin-pages";
import { env } from 'process';


export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: "src/pages",
    }) as any,
  ],
  server: {
    proxy: {
      '/api': {
        target: `${env.Base_Url}`,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      },

    }
  }
} as UserConfig) 