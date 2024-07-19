/** @format */

import { defineConfig } from "tsup";


export default defineConfig({
  entry: ["auth.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
});