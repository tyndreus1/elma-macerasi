import { defineConfig } from "vite";

export default defineConfig({
  // Relative paths so GitHub Pages project sites and Netlify both work.
  base: "./",
  server: {
    host: true,
    port: 43180,
  },
  preview: {
    host: true,
    port: 43180,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
