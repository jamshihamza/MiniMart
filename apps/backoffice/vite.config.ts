import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Relative asset paths so the build can be served under /backoffice/ on the demo server.
  base: "./",
  plugins: [react()],
  server: {
    port: 1421,
    strictPort: true,
    proxy: { "/api/demo": "http://127.0.0.1:4780" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
