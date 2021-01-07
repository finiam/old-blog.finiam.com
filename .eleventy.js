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

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["html", "liquid", "njk", "md"]);

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
    collectionApi.getFilteredByGlob(["site/blog/*.md"]).map((post) => {
      if (post.data.author) {
        post.data.author = require(`./site/_data/authors/${post.data.author}.json`);
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
