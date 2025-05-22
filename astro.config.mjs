// @ts-check
import { defineConfig } from "astro/config";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
	site: "https://myblogray.netlify.app",
	base: "/",
	integrations: [image()],
});
