<script lang="ts">
	const { data } = $props();
</script>

<h1>All Posts</h1>

<span>{data.postCount}</span>

<pre>{JSON.stringify(data, null, 2)}</pre>
