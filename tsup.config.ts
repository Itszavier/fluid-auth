/** @format */

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/**/*.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "googleapis"], // Externalize dependencies
  tsconfig: "./tsconfig.json", // Ensure tsconfig.json is being used
  outDir: "dist",
});
