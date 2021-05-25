
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventyHelmetPlugin = require("eleventy-plugin-helmet");
const markdownIt = require("markdown-it");
const mdImplicitFigures = require("markdown-it-implicit-figures");
const mdPrism = require("markdown-it-prism");
const htmlmin = require("html-minifier");
const markdownItRenderer = new markdownIt({ html: true })
  .use(mdImplicitFigures)
  .use(mdPrism);
const image = require("./utils/image");

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["html", "liquid", "njk", "md"]);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(eleventyHelmetPlugin);

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("markdownify", (str) =>
    markdownItRenderer.render(str),
  );

  eleventyConfig.addFilter("markdownifyInline", (str) =>
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
