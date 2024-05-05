import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
	],
	build: {
		sourcemap: "inline",
		minify: false,
		rollupOptions: {
			input: resolve(__dirname, "src/main.tsx"),
			output: {
				entryFileNames: `react-card.js`,
				chunkFileNames: `[name].js`,
				assetFileNames: `[hash].[ext]`,
			},
		},
		watch: {
			include: 'src/**/*.tsx', // Add this line
		},
	},
	server: {
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		cors: true,
	}
});
