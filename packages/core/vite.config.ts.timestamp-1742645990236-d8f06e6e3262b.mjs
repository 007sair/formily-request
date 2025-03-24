// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///Users/longchan/Desktop/sair/formily-request/node_modules/.pnpm/vite@4.5.9/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/longchan/Desktop/sair/formily-request/node_modules/.pnpm/vite-plugin-dts@3.9.1_typescript@5.4.2_vite@4.5.9/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/longchan/Desktop/sair/formily-request/packages/core";
var vite_config_default = defineConfig({
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "FormilyRequest",
      formats: ["es", "umd"],
      fileName: "index"
    },
    sourcemap: true,
    target: "es2015",
    rollupOptions: {
      external: ["@formily/reactive", "@formily/react"],
      output: {
        globals: {
          "@formily/reactive": "FormilyReactive",
          "@formily/react": "FormilyReact"
        }
      }
    }
  },
  plugins: [dts({ rollupTypes: true })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbG9uZ2NoYW4vRGVza3RvcC9zYWlyL2Zvcm1pbHktcmVxdWVzdC9wYWNrYWdlcy9jb3JlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbG9uZ2NoYW4vRGVza3RvcC9zYWlyL2Zvcm1pbHktcmVxdWVzdC9wYWNrYWdlcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sb25nY2hhbi9EZXNrdG9wL3NhaXIvZm9ybWlseS1yZXF1ZXN0L3BhY2thZ2VzL2NvcmUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICBuYW1lOiBcIkZvcm1pbHlSZXF1ZXN0XCIsXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXSxcbiAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXG4gICAgfSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgdGFyZ2V0OiBcImVzMjAxNVwiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXCJAZm9ybWlseS9yZWFjdGl2ZVwiLCBcIkBmb3JtaWx5L3JlYWN0XCJdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICBcIkBmb3JtaWx5L3JlYWN0aXZlXCI6IFwiRm9ybWlseVJlYWN0aXZlXCIsXG4gICAgICAgICAgXCJAZm9ybWlseS9yZWFjdFwiOiBcIkZvcm1pbHlSZWFjdFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbZHRzKHsgcm9sbHVwVHlwZXM6IHRydWUgfSldLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdXLFNBQVMsZUFBZTtBQUN4WCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFGaEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLElBQ0wsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxxQkFBcUIsZ0JBQWdCO0FBQUEsTUFDaEQsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AscUJBQXFCO0FBQUEsVUFDckIsa0JBQWtCO0FBQUEsUUFDcEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxLQUFLLENBQUMsQ0FBQztBQUN0QyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
