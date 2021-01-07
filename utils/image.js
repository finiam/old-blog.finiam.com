const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

const IMAGES_ROOT = "./static/";
const OUTPUT_PATH = "./_output/optimized_images/";
const URL_PATH = "/optimized_images/";

// DO NOT IDENT THIS PLEASE OTHERWHISE IT WILL BREAK
// A LIMTATION FROM MARKDOWN-IT

function skipOptimization(src, alt, klass) {
  return `
<picture>
<img
loading="lazy"
alt="${alt}"
src="${src}"
class="${klass}">
</picture>`;
}

module.exports = async (src, alt, klass, responsive = false) => {
  try {
    if (!alt) throw new Error(`Missing \`alt\` from: ${src}`);

    if (!src) return;

    if (process.env.NODE_ENV !== "production")
      return skipOptimization(src, alt, klass);

    const metadata = await Image(path.join(IMAGES_ROOT, src), {
      formats: ["avif", "jpeg"],
      outputDir: OUTPUT_PATH,
      urlPath: URL_PATH,
      widths: responsive ? [320, 480, 800, 1024, 1280] : [null],
    });

    const imageAttributes = {
      alt,
      class: klass,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  } catch (error) {
    console.error(`Error on ${src}`);

    throw error;
  }
};
