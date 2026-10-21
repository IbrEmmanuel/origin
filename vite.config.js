import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const agentBase = (env.VITE_SALES_AGENT_URL || 'https://staging-ai-agent.fly.dev').replace(/\/$/, '')

    return {
        plugins: [vue()],
        // Allow uppercase image extensions (e.g. .JPG, .JPEG) from device photos
        assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG', '**/*.HEIC'],
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
                // Auth / marketplace / etc — same-origin proxy avoids CORS blocks
                '/api': {
                    target: 'https://api.originelectricltd.com',
                    changeOrigin: true,
                    secure: true,
                    headers: {
                        origin: 'https://www.originelectricltd.com',
                        referer: 'https://www.originelectricltd.com/',
                        'user-agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        accept: 'application/json',
                    },
                },
            },
        },
    }
})
