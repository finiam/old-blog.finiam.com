const markdownIt = require("markdown-it");
const mdImplicitFigures = require("markdown-it-implicit-figures");
const markdownItRenderer = new markdownIt({ html: true }).use(
  mdImplicitFigures,
);
const image = require("./utils/image");

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["html", "liquid", "md"]);

  eleventyConfig.addFilter("markdownify", (str) =>
    markdownItRenderer.renderInline(str),
  );

  eleventyConfig.addFilter("startsWith", (string, arg) =>
    string.startsWith(arg),
  );

  eleventyConfig.addFilter(
    "activeUrl",
    (desiredUrl, pageUrl, active, inactive) =>
      desiredUrl === pageUrl ? active : inactive,
  );

  eleventyConfig.addFilter("getAuthor", (authorKey) =>
    require(`./src/_data/authors/${authorKey}.json`),
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob(["src/blog/*.md"]).map((post) => {
      if (post.data.author) {
        post.data.author = require(`./src/_data/authors/${post.data.author}.json`);
      }

      return post;
    }),
  );

  eleventyConfig.addShortcode("image", async (src, alt, klass = "") =>
    image(src, alt, klass, false),
  );

  eleventyConfig.addShortcode("responsiveImage", async (src, alt, klass = "") =>
    image(src, alt, klass, true),
  );

  eleventyConfig.setLibrary("md", markdownItRenderer);

  return {
    dir: {
      input: "src/",
      data: "_data",
      includes: "_includes",
      output: "_output",
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
