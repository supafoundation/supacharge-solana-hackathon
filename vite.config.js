import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import path from 'path';

// https://vitejs.dev/config/
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
            // '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        chunkSizeWarningLimit: 3600,
        rollupOptions: {
            // https://rollupjs.org/guide/en/#big-list-of-options
        },
        target: 'es2020',
    },
    define: {
        'process.env': { ANCHOR_BROWSER: true}

          
    },
    
    optimizeDeps: {
        esbuildOptions:{
            target:'es2020'
        }
    },
    base: './'
});
