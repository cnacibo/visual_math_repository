import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../static/dist', // Указываем папку для выходных файлов
        emptyOutDir: true, // Очищает папку outDir перед сборкой
        rollupOptions: {
            output: {
                entryFileNames: 'assets/main.js', // Указываем путь и имя для JS файла
                assetFileNames: 'assets/index.[ext]', // Указываем путь и имя для CSS файла
            },
        },
    },
    server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000', // Адрес вашего Django
    },
  },
});