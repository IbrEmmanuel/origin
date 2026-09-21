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
            // /api/agent/* → agent server (dev only — Vercel edge fn handles prod)
            '/api/agent': {
                target: 'https://agent.originelectricltd.com',
                changeOrigin: true,           // sets Origin: https://agent.originelectricltd.com
                headers: {
                    origin: 'https://originelectricltd.com',  // spoof origin the server trusts
                    referer: 'https://originelectricltd.com/',
                },
                rewrite: (p) => p.replace(/^\/api\/agent/, ''),
            },
        },
    },
})
