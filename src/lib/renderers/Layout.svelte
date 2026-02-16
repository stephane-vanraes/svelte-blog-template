<script lang="ts" module>
	import { details, summary } from './components';
	export { details, summary };
</script>

<script lang="ts">
	const { children } = $props();
</script>

{@render children?.()}
