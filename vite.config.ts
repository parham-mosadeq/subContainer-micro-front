import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import topLevelAwait from "vite-plugin-top-level-await";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait(),
    federation({
      name: "subContainer",
      filename: "remoteEntry.js",
      exposes: {
        "./Editor": "./src/Editor.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    host: "localhost",
    port: 5002,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
