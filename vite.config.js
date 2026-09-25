import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const agentBase = (env.VITE_SALES_AGENT_URL || 'https://staging-ai-agent.fly.dev').replace(/\/$/, '')

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            proxy: {
                '/api/agent': {
                    target: agentBase,
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
    }
})
