import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import rehypeComponentTags from './src/lib/renderers/plugins/rehype-component-tags.js';
import remarkCollapsible from './src/lib/renderers/plugins/remark-collapsibles.js';

const layoutPath = fileURLToPath(new URL('./src/lib/renderers/Layout.svelte', import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			layout: {
				_: layoutPath
			},
			rehypePlugins: [rehypeComponentTags],
			remarkPlugins: [remarkCollapsible]
		})
	],

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
