import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
// import mkcert from 'vite-plugin-mkcert';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        // mkcert(), // Requires: sudo ~/.vite-plugin-mkcert/mkcert -install
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        // https: true, // Enable after running: sudo ~/.vite-plugin-mkcert/mkcert -install
        host: '0.0.0.0',
        hmr: {
            host: '192.168.100.25',
        },
        cors: true,
    },
    esbuild: {
        jsx: 'automatic',
    },
});
