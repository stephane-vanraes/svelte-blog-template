import type { Post } from '../../content-collections';

export function buildRelated(posts: Post[]): Record<string, string[]> {
	// 1) Build inverted index: tag -> [slugs...]
	const tagToSlugs = new Map<string, string[]>();
	for (const p of posts) {
		for (const t of p.tags ?? []) {
			const arr = tagToSlugs.get(t);
			if (arr) arr.push(p.slug);
			else tagToSlugs.set(t, [p.slug]);
		}
	}

	// 2) For each post: union of slugs that share any tag (excluding self)
	const related: Record<string, string[]> = Object.create(null);

	for (const p of posts) {
		const set = new Set<string>();

		for (const t of p.tags ?? []) {
			const slugs = tagToSlugs.get(t);
			if (!slugs) continue;

			for (const s of slugs) {
				if (s !== p.slug) set.add(s);
			}
		}

		// stable-ish output (optional, but makes diffs nice)
		related[p.slug] = Array.from(set).sort();
	}

	return related;
}
