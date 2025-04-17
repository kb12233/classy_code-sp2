import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
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
  // Ensure AI provider libraries are properly bundled
  resolve: {
    alias: {
      // Add any aliases if needed for compatibility
    }
  },
  // Allow your app to make cross-origin requests to AI services
  server: {
    cors: true
  }
})