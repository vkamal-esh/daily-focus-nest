
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import electron from "vite-plugin-electron";

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
    electron([
      {
        entry: "electron/main.ts",
        onstart: (options) => {
          if (options.startup) {
            options.startup()
          }
        },
        vite: {
          build: {
            sourcemap: mode === 'development',
            minify: mode !== 'development',
            outDir: "dist-electron",
            rollupOptions: {
              external: ["electron"]
            }
          }
        }
      },
      {
        entry: "electron/preload.ts",
        onstart: (options) => {
          options.reload()
        },
        vite: {
          build: {
            sourcemap: mode === 'development',
            minify: mode !== 'development',
            outDir: "dist-electron",
            rollupOptions: {
              external: ["electron"]
            }
          }
        }
      }
    ])
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
}));
