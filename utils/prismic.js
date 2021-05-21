const Prismic = require("prismic-javascript");

const API_URL = "https://finiam.cdn.prismic.io/api/v2";

async function queryPrismic(type) {
  try {
    const client = Prismic.client(API_URL);

    const req = await client.query(
      Prismic.Predicates.at("document.type", type),
    );

    return req.results;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    return err.message;
  }
}

let CACHED_AUTHORS;

async function getAllAuthors() {
  if (CACHED_AUTHORS) return CACHED_AUTHORS;

  const data = await queryPrismic("team_member");
  CACHED_AUTHORS = data;

  return data;
}

module.exports = {
  getAllAuthorsNames: async () => {
    const authors = await getAllAuthors();

    return authors.map((item) => item.uid);
  },
  getAuthor: async (uid) => {
    const authors = await getAllAuthors();

    return authors.find((author) => author.uid === uid)?.data;
  },
};
