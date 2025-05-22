
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { crx } from "@crxjs/vite-plugin";
import manifestJson from './public/manifest.json';

// Create a properly typed manifest object that conforms to ManifestV3 type requirements
const manifest = {
  ...manifestJson,
  // Ensure background.type is explicitly the string literal "module"
  background: {
    ...manifestJson.background,
    type: "module" as const
  }
};

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
    crx({ manifest }),
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
          return chunk.name === 'background' ? 'background.js' : 
                 chunk.name === 'content' ? 'content-script.js' :
                 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
      }
    },
  }
}));
