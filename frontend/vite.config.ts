import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            // Proxy all /api/* requests to the FastAPI backend
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            // Proxy static assets used by XSLT-rendered HTML
            "/CSS": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "/Scripts": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "/images": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
            "/response-html": {
                target: "http://localhost:8000",
                changeOrigin: true,
            },
        },
        allowedHosts: ["len-auxochromic-bobbi.ngrok-free.dev"],
    },
});
