import type { Plugin, ViteDevServer } from 'vite';
import path from 'node:path';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import type { Post } from './content-collections';
import graph from './scripts/content-graph/index.ts';

const PLUGIN_NAME = 'content-graph';

const GENERATED_MODULE_REL = './.content-collections/generated/allPosts.js';
const OUT_DIR_REL = './.content-graph/generated';
const OUT_FILE_NAME = 'index.js';

export function contentGraph(): Plugin {
	let root = process.cwd();

	const absPostsModule = () => path.resolve(root, GENERATED_MODULE_REL);
	const absOutDir = () => path.resolve(root, OUT_DIR_REL);
	const absOutFile = () => path.join(absOutDir(), OUT_FILE_NAME);

	async function loadPosts(): Promise<Post[]> {
		const absPath = absPostsModule();
		const url = pathToFileURL(absPath);
		url.searchParams.set('t', String(Date.now())); // cache-bust
		const mod = await import(url.href);
		return mod?.default;
	}

	async function runAnalysis() {
		try {
			const outDir = absOutDir();
			const outFile = absOutFile();
			const posts = await loadPosts();
			const related = graph.buildRelated(posts);

			const content = `// auto-generated
export const postCount = ${posts.length};
export const related = ${JSON.stringify(related, null, 2)};
`;

			await fs.mkdir(outDir, { recursive: true });
			await fs.writeFile(outFile, content, 'utf8');
		} catch (err) {
			console.error(`[${PLUGIN_NAME}] failed`, err);
		}
	}

	function wireWatch(server: ViteDevServer) {
		const target = absPostsModule();
		const onFsEvent = (file: string) => {
			if (path.resolve(file) === target) {
				void runAnalysis();
			}
		};

		server.watcher.add(target);
		server.watcher.on('add', onFsEvent);
		server.watcher.on('change', onFsEvent);
	}

	return {
		name: PLUGIN_NAME,
		enforce: 'post',

		configResolved(config) {
			root = config.root;
		},

		async buildStart() {
			await runAnalysis();
		},

		configureServer(server) {
			wireWatch(server);
		}
	};
}

export default contentGraph;
