import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [ [ 'babel-plugin-react-compiler' ] ],
      },
    }),
    polyfillNode({
      globals: { buffer: true },
      polyfills: {
        stream: true,
      },
    }),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
})
