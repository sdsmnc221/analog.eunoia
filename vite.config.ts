import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/notion-api": {
        target: "https://api.notion.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notion-api/, ""),
      },
    },
  },
});
