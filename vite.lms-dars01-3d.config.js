import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "lms_dars01_3d_build",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "lms_dars01_3d.html"),
    },
  },
});
