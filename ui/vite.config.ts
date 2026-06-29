import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/brags/",
  publicDir: "../dist",
  build: {
    outDir: "../dist",
    emptyOutDir: false,
    // rollupOptions: {
    //   output: {
    //     manualChunks: (id) => {
    //       if (id.includes("react-dom")) return "react-dom";
    //       if (id.includes("react")) return "react";
    //     },
    //   },
    // },
    // chunkSizeWarningLimit: 1000,
  },
});
