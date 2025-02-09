import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
        },
    },
},
})
