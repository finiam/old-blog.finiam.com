const { request, gql } = require("graphql-request");

const postsQuery = gql`
  query {
    allPost(sort: { publishedAt: DESC }) {
      slug {
        current
      }
      title
      description
      keywords
      long_description: longDescription
      featured_image: featuredImage {
        asset {
          url
        }
      }
      featured_image_alt: featuredImageAlt
      category
      published_at: publishedAt
      body
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

module.exports = async () => {
  const { allPost } = await request(process.env.CMS_URL, postsQuery);

  return {
    all: allPost,
    development: allPost.filter((post) => post.category === "development"),
    design: allPost.filter((post) => post.category === "design"),
    team: allPost.filter((post) => post.category === "team"),
  };
};
