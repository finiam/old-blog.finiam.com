import type { RequestHandler } from '@sveltejs/kit';

const QUERY = `
  query {
    allPost(sort: { publishedAt: DESC }) {
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

export const get: RequestHandler = async () => {
	const response = await fetch(process.env['CMS_URL'], {
		method: 'POST',
		headers: new Headers({ 'content-type': 'application/json' }),
		body: JSON.stringify({
			query: QUERY
		})
	});
	const posts = (await response.json()).data.allPost;

	return {
		body: posts,
		status: 200,
		headers: {
			'cache-control': 'public, s-maxage=300'
		}
	};
};
