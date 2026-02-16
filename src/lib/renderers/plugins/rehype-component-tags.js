function rewriteRawTags(value) {
	return value
		.replace(/<\s*details(\s|>)/gi, '<Components.details$1')
		.replace(/<\s*\/\s*details\s*>/gi, '</Components.details>')
		.replace(/<\s*summary(\s|>)/gi, '<Components.summary$1')
		.replace(/<\s*\/\s*summary\s*>/gi, '</Components.summary>');
}

function visit(node) {
	if (!node || typeof node !== 'object') return;

	if (node.type === 'raw' && typeof node.value === 'string') {
		node.value = rewriteRawTags(node.value);
	}

	if (node.type === 'element') {
		if (node.tagName === 'details') node.tagName = 'Components.details';
		if (node.tagName === 'summary') node.tagName = 'Components.summary';
	}

	if (Array.isArray(node.children)) {
		for (const child of node.children) visit(child);
	}
}

export default function rehypeComponentTags() {
	return (tree) => visit(tree);
}
