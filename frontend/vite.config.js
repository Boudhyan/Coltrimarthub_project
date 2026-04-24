import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Dev/preview: proxy /api → FastAPI so the browser always talks to the Vite origin
 * (fixes LAN access: opening http://192.168.x.x:5173 no longer calls 127.0.0.1 on the client).
 * Set VITE_API_URL=/api in .env (see .env.example).
 */
const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
});
