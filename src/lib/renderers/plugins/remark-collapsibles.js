const COLLAPSIBLE_START = /^\s*{%\s*collapsible\s+(?:"([^"]+)"|“([^”]+)”)\s*%}\s*$/;
const COLLAPSIBLE_END = /^\s*{%\s*endcollapsible\s*%}\s*$/;

function getParagraphText(node) {
	if (node.type !== 'paragraph' || !node.children || node.children.length === 0) {
		return null;
	}

	let text = '';
	for (const child of node.children) {
		if (child.type !== 'text' || typeof child.value !== 'string') {
			return null;
		}
		text += child.value;
	}

	return text;
}

function getStartMatch(node) {
	const text = getParagraphText(node);
	return text ? COLLAPSIBLE_START.exec(text) : null;
}

function isEndMarker(node) {
	const text = getParagraphText(node);
	return !!text && COLLAPSIBLE_END.test(text);
}

function transformParent(parent) {
	const { children } = parent;
	let i = 0;

	while (i < children.length) {
		const startMatch = getStartMatch(children[i]);
		if (!startMatch) {
			const child = children[i];
			if (child.children) transformParent(child);
			i += 1;
			continue;
		}

		let endIndex = -1;
		for (let j = i + 1; j < children.length; j += 1) {
			if (isEndMarker(children[j])) {
				endIndex = j;
				break;
			}
		}

		if (endIndex === -1) {
			const child = children[i];
			if (child.children) transformParent(child);
			i += 1;
			continue;
		}

		const summary = startMatch[1] ?? startMatch[2];
		const innerNodes = children.slice(i + 1, endIndex);

		children.splice(
			i,
			endIndex - i + 1,
			{ type: 'html', value: `<details>\n<summary>${summary}</summary>` },
			...innerNodes,
			{ type: 'html', value: '</details>' }
		);

		i += innerNodes.length + 2;
	}
}

export default function collapsibles() {
	return (tree) => {
		if (tree.children) transformParent(tree);
	};
}
