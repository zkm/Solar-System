import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset URLs, so the build works under /Solar-System/ on GitHub Pages.
  base: "./",
  server: { port: 3000 },
  test: {
    environment: "happy-dom",
  },
});
