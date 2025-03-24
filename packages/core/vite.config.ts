import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FormilyRequest",
      formats: ["es", "umd"],
      fileName: "index",
    },
    sourcemap: true,
    target: "es2015",
    rollupOptions: {
      external: ["@formily/reactive", "@formily/react"],
      output: {
        globals: {
          "@formily/reactive": "FormilyReactive",
          "@formily/react": "FormilyReact",
        },
        exports: "named",
      },
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
