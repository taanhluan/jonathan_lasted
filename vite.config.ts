import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/jonathan_lasted/", // 👈 thêm dòng này
  plugins: [react()],
});