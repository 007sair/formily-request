import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "FormilyAsync",
      formats: ["es", "umd"],
      fileName: "index",
    },
    sourcemap: true,
    target: "es2015",
  },
  plugins: [dts({ rollupTypes: true })],
});
