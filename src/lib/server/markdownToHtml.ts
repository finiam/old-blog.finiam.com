import markdownIt from 'markdown-it';
import mdImplicitFigures from 'markdown-it-implicit-figures';
import markdownItAttrs from 'markdown-it-attrs';
import highlight from 'highlight.js';

const markdownItRenderer = new markdownIt({
	html: true,
	highlight: (code, language) => {
		if (language) {
			try {
				return (
					`<pre class="language-${language}"><code>` +
					highlight.highlight(code, { language }).value +
					'</code></pre>'
				);
			} catch (__) {
				// noop
			}
		}

		return code;
	}
})
	.use(markdownItAttrs)
	.use(mdImplicitFigures);

// override custom image rule to add sanity params
markdownItRenderer.renderer.rules.image = function (tokens, idx, options, env, slf) {
	const token = tokens[idx];

	// "alt" attr MUST be set, even if empty. Because it's mandatory and
	// should be placed on proper position for tests.
	//
	// Replace content with actual value
	token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(token.children, options, env);

	return slf.renderToken(
		tokens.map((token) => ({
			...token,
			attrs: token.attrs.map((attrs) => {
				const [attrName, attrValue, ...rest] = attrs;

				if (attrName === 'src' && attrValue.startsWith('https://cdn.sanity.io/')) {
					const [path, queryString] = attrValue.split('?');

					if (queryString) return [attrName, `${path}?${queryString}&auto=format`, ...rest];

					return [attrName, `${attrValue}?w=756&q=75&auto=format`, ...rest];
				}

				return attrs;
			})
		})),
		idx,
		options
	);
};

export default function markdownToHtml(markdown: string): string {
	return markdownItRenderer.render(markdown);
}
