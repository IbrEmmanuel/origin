import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            '/api/agent': {
                target: 'https://agent.originelectricltd.com',
                changeOrigin: true,
                secure: false,
                headers: {
                    origin: 'https://originelectricltd.com',
                    referer: 'https://originelectricltd.com/',
                },
                rewrite: (p) => p.replace(/^\/api\/agent/, ''),
            },
        },
    },
})
