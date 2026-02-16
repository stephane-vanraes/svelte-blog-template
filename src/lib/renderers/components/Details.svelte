<script lang="ts">
	const { children, ...rest } = $props();
</script>

<details {...rest}>
	{@render children?.()}
</details>
