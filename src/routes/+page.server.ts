import { allPosts } from '$content-collections';
import { postCount } from '$content-graph';

export async function load() {
	return {
		allPosts,
		postCount
	};
}
