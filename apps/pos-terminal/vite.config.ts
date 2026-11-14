import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Relative asset paths so the same build works in Tauri and under /pos/ on the demo server.
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    port: 1420,
    strictPort: true,
    // Development convenience: forward demonstration API calls to a locally running demo server.
    proxy: { "/api/demo": "http://127.0.0.1:4780" },
    watch: { ignored: ["**/src-tauri/**"] },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
