import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

const apiEndpoint = process.env["API_ENDPOINT"] || null;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			...(apiEndpoint && {
				"/api": {
					target: apiEndpoint,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			}),
		},
	},
});
