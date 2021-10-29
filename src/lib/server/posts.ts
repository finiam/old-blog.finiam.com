import type { Post } from '$lib/types';

const GET_POSTS_QUERY = `
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

export default async function getPosts(): Promise<Post[]> {
	const response = await fetch(process.env['CMS_URL'], {
		method: 'POST',
		headers: new Headers({ 'content-type': 'application/json' }),
		body: JSON.stringify({
			query: GET_POSTS_QUERY
		})
	});
	const posts = (await response.json()).data.allPost;

	return posts;
}

const GET_POST_QUERY = `
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

export async function getPost(slug: string): Promise<Post> {
	const response = await fetch(process.env['CMS_URL'], {
		method: 'POST',
		headers: new Headers({ 'content-type': 'application/json' }),
		body: JSON.stringify({
			query: GET_POST_QUERY,
			variables: {
				slug
			}
		})
	});
	const post = (await response.json()).data?.allPost?.[0];

	return post;
}
