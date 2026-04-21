import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    base: "/jonathanta/", // 👈 thêm dòng này
    plugins: [react()],
});
