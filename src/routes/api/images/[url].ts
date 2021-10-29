import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (request) => {
	const url = decodeURIComponent(request.params.url);

	if (!url?.startsWith('https://cdn.sanity.io/')) {
		return {
			status: 400
		};
	}

	const response = await fetch(url, {
		method: 'GET'
	});

	return {
		body: new Uint8Array(await response.arrayBuffer()),
		status: 200,
		headers: {
			...(response.headers as unknown as Record<string, string>),
			'cache-control': 'public, s-maxage=31536000'
		}
	};
};
