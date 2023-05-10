import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: loadEnv(mode, process.cwd()).VITE_APP_PATH,
    // base: "diary",
    // base: "/",
    resolve: {
      alias: {
        "@": path.join(__dirname, "./src"),
      },
    },
    plugins: [vue()],
    server: {
      port: 3000, // 打开的端口号
      open: true, // 运行时打开浏览器
      proxy: {
        "/ache": {
          target: "http://101.42.230.165:8080/",
          // target: "http://localhost:8080/",
          pathRewrite: {
            "^/ache": "",
          },
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
});
