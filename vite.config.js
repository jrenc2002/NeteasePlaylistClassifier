import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                // 不需要 rewrite，因为API路径本身就包含 /api
                // rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
