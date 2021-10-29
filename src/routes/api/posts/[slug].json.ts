import markdownToHtml from '$lib/server/markdownToHtml';
import type { RequestHandler } from '@sveltejs/kit';

const QUERY = `
  query($slug: String!) {
    allPost(sort: { publishedAt: DESC }, where: {slug: {current: {eq: $slug}}}) {
      slug {
        current
      }
      title
      description
      keywords
      longDescription
      featuredImage {
        asset {
          url
        }
      }
      body
      featuredImageAlt
      category
      publishedAt
      author {
        name
        role
        image {
          asset {
            url
          }
        }
      }
    }
  }
`;

export const get: RequestHandler = async (request) => {
	const response = await fetch(process.env['CMS_URL'], {
		method: 'POST',
		headers: new Headers({ 'content-type': 'application/json' }),
		body: JSON.stringify({
			query: QUERY,
			variables: {
				slug: request.params.slug
			}
		})
	});
	const post = (await response.json()).data?.allPost?.[0];

	if (!post) {
		return { status: 404 };
	}

	return {
		body: { ...post, body: markdownToHtml(post.body) },
		status: 200,
		headers: {
			'cache-control': 'public, s-maxage=300'
		}
	};
};
