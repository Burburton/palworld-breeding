import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo name must match the GitHub repository.
// Update `base` if you rename the repository.
export default defineConfig({
  plugins: [react()],
  base: "/palworld-breeding/",
});