import RSS from 'rss';
import { convert } from 'rel-to-abs';
import type { RequestHandler } from '@sveltejs/kit';
import getPosts from '$lib/server/posts';

const feed = new RSS({
	title: "Finiams's blog",
	description: 'Our thoughts on development and design.',
	site_url: 'https://finiam.com',
	feed_url: 'https://finiam.com/api/posts/rss.xml'
});

export const get: RequestHandler = async () => {
	const posts = await getPosts();

	posts.forEach((post) => {
		feed.item({
			date: post.publishedAt,
			description: convert(post.body, 'https://finiam.com/'),
			title: post.title,
			url: 'https://finiam.com/blog/' + post.slug,
			author: 'Francisco Sousa'
		});
	});

	return {
		body: feed.xml(),
		status: 200,
		headers: {
			'cache-control': 'public, s-maxage=604800'
		}
	};
};
