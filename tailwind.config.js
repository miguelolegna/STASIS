import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importa o novo plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Adiciona o Tailwind aqui
  ],
})