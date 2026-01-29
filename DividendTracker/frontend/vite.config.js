import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 只要是 /users 開頭，就幫我轉送到 dividend.local
      '/users': {
        target: 'http://dividend.local', // 這裡填你的 Ingress 網址
        changeOrigin: true, // ⚠️ 關鍵：這會把 Host header 改成 dividend.local
        secure: false,
      },
      '/dividends': {
        target: 'http://dividend.local',
        changeOrigin: true,
        secure: false,
      },
      '/stocks': {
        target: 'http://dividend.local',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
