import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Make sure base path is correctly set for production
  base: './',
  // Ensure all environment variables are properly exposed to the frontend
  define: {
    // This makes process.env available in the frontend for libraries that expect it
    'process.env': {}
  },
  // Optimize dependency bundling
  optimizeDeps: {
    include: [
      '@fontsource/jetbrains-mono',
      '@fontsource/inter',
      'plantuml-encoder',
      'plantuml-transpiler',
      'file-saver'
    ]
  },
  // Allow your app to make cross-origin requests to AI services
  server: {
    cors: true
  }
})