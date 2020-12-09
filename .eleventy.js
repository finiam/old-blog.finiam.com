const lazyImagesPlugin = require("eleventy-plugin-lazyimages");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyHelmetPlugin = require('eleventy-plugin-helmet');
const markdownIt = require("markdown-it");
const mdImplicitFigures = require("markdown-it-implicit-figures");
const markdownItRenderer = new markdownIt().use(mdImplicitFigures);

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "liquid",
    "md",
    // Static Assets:
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2",
  ]);

  eleventyConfig.addPlugin(lazyImagesPlugin, {
    imgSelector: '[data-lazy="true"]',
    transformImgPath: (src) => `./src/static/${src}`,
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(eleventyHelmetPlugin);

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

  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  eleventyConfig.setLibrary("md", markdownItRenderer);

  return {
    dir: {
      input: "src/",
      data: "_data",
      includes: "_includes",
      output: "_output",
    },
  };
};
