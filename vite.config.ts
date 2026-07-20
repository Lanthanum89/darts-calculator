import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      manifest: {
        name: "Darts Checkout Calculator",
        short_name: "Darts Checkout",
        description: "Suggests optimal darts checkout finishes for any score from 2 to 170.",
        start_url: "./index.html",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#020617",
        theme_color: "#3b82f6",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{html,js,css,png,svg,webmanifest}"]
      }
    })
  ]
});
