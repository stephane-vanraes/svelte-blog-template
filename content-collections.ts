import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

export const PostSchema = z.object({
	title: z.string(),
	summary: z.string(),
	tags: z.array(z.string()).default([])
});

export type Post = z.infer<typeof PostSchema> & { slug: string };

const posts = defineCollection({
	name: 'posts',
	directory: 'src/routes/posts',
	include: '**/*.svx',
	parser: 'frontmatter-only',
	schema: PostSchema,
	transform: (doc) => ({
		slug: doc._meta.directory,
		summary: doc.summary,
		title: doc.title,
		tags: doc.tags
	})
});

export default defineConfig({
	collections: [posts]
});
