
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { crx } from "@crxjs/vite-plugin";
import manifestJson from './public/manifest.json';

// Ensure the manifest is correctly typed for CRXJS
const manifest = {
  ...manifestJson,
  manifest_version: 3,
  background: {
    service_worker: "src/background.ts",
    type: "module" as const  // Using 'as const' to ensure it's treated as a literal type
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
      }
    },
  }
}));
