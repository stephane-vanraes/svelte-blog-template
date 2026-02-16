<script lang="ts">
	const { children, ...rest } = $props();
</script>

<summary {...rest}>
	{@render children?.()}
</summary>

<style>
	summary {
		background-color: pink;
	}
</style>
