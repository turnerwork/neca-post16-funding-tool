import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Project site: https://turnerwork.github.io/neca-post16-funding-tool/
const REPO_NAME = "neca-post16-funding-tool";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? `/${REPO_NAME}/` : "/",
  plugins: [react(), tailwindcss()],
}));
