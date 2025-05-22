
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { crx } from "@crxjs/vite-plugin";
import manifest from './public/manifest.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    crx({ manifest: {
      ...manifest,
      background: {
        ...manifest.background,
        type: "module" // Ensure this is specifically "module" not a variable string
      }
    } }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        content: path.resolve(__dirname, "src/content-script.tsx"),
        background: path.resolve(__dirname, "src/background.ts")
      },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js';
        }
      }
    },
  }
}));
