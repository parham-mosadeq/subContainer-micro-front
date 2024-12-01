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
        "./EditorMessageBroker": "./src/utils/message-broker/index.ts",
        "./useToken": "./src/utils/token/index.ts",
      },
      shared: ["react", "react-dom", "rxjs"],
    }),
  ],
  build: {
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
  },
  preview: {
    host: "localhost",
    port: 5002,
  },
});
