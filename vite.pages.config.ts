import { defineConfig } from "vite";

/** Pages publish build: Phaser from CDN so the game bundle stays under GitHub Contents API 1MB. */
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "phaser-cdn-script",
      transformIndexHtml(html) {
        return html.replace(
          "<head>",
          '<head>\n    <script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>',
        );
      },
    },
  ],
  build: {
    outDir: "dist-pages",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      external: ["phaser"],
      output: {
        paths: {
          phaser: "../phaser-global.js",
        },
        manualChunks(id) {
          if (id.includes("titleHeroesUrl.p")) {
            const m = id.match(/titleHeroesUrl\.p[\w]+\.ts$/);
            return m ? m[0].replace(".ts", "") : "title-part";
          }
          if (id.includes("titleHeroesUrl")) return "title";
          if (id.includes("/sprites.ts")) return "sprites";
          if (id.includes("/PlayScene.ts")) return "play";
          if (id.includes("/actors.ts")) return "actors";
          if (id.includes("/levels.ts")) return "levels";
          if (id.includes("/font.ts")) return "font";
          if (id.includes("/StatusScenes.ts")) return "status";
          if (id.includes("/TitleScene.ts")) return "titlescene";
          return undefined;
        },
      },
    },
  },
});
