import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		adapter: adapter(),

		alias: {
			'$content-collections': './.content-collections/generated',
			'$content-graph': './.content-graph/generated'
		}
	},

	extensions: ['.svelte', '.svx']
};

export default config;
