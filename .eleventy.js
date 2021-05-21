const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyHelmetPlugin = require("eleventy-plugin-helmet");
const markdownIt = require("markdown-it");
const mdImplicitFigures = require("markdown-it-implicit-figures");
const htmlmin = require("html-minifier");
const markdownItRenderer = new markdownIt({ html: true }).use(
  mdImplicitFigures,
);
const image = require("./utils/image");
const { getAuthor } = require("./utils/prismic");

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    "html",
    "liquid",
    "njk",
    "md",
    "yml",
    "11ty.js",
  ]);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(eleventyHelmetPlugin);

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("markdownify", (str) =>
    markdownItRenderer.renderInline(str),
  );

  eleventyConfig.addFilter("startsWith", (string, arg) =>
    string.startsWith(arg),
  );

  eleventyConfig.addFilter(
    "activeUrl",
    (desiredUrl, pageUrl, activeClass, inactiveClass) =>
      desiredUrl === pageUrl ? activeClass : inactiveClass,
  );

  eleventyConfig.addFilter("getAuthor", (authorKey) =>
    require(`./site/_data/authors/${authorKey}.json`),
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    Promise.all(
      collectionApi.getFilteredByGlob(["site/blog/*.md"]).map(async (post) => {
        if (post.data.author) {
          post.data.author = await getAuthor(post.data.author);
        }

        return post;
      }),
    ),
  );

  eleventyConfig.addShortcode("image", async (src, alt, klass = "") =>
    image(src, alt, klass, false),
  );

  eleventyConfig.addShortcode("responsiveImage", async (src, alt, klass = "") =>
    image(src, alt, klass, true),
  );

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.setLibrary("md", markdownItRenderer);

  return {
    dir: {
      input: "site/",
      data: "_data",
      includes: "_includes",
      output: "_output",
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
