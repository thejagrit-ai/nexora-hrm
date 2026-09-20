import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    allowedHosts: [".ngrok-free.dev"],
    proxy: {
      "/api/recruit": {
        target: "http://localhost:4500",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/recruit/, "/api/v1"),
      },
      "/api/payroll": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/payroll/, "/api/v1"),
      },
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/oauth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/.well-known": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // Chat realtime (socket.io). ws:true forwards the WebSocket upgrade.
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
