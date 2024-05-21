import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import { visualizer } from "rollup-plugin-visualizer";

const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  plugins: [
    react(),
    glsl(),
    visualizer({
      open: true, // Ceci ouvrira automatiquement le rapport dans votre navigateur
      filename: "bundle-analysis.html", // Nom du fichier de sortie du rapport
    }),
  ],
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
};
