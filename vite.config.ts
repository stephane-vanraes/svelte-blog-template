import { sveltekit } from '@sveltejs/kit/vite';
import contentCollections from '@content-collections/vite';
import contentGraph from './content-graph';

import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), contentCollections(), contentGraph()]
});
