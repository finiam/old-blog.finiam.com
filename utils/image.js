const Image = require("@11ty/eleventy-img");

module.exports = async (src, alt, klass, responsive = false) => {
  if (!alt) {
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }

  if (!src) return;

  const path = `./src/static/${src}`;
  let stats = await Image(path, {
    widths: responsive ? [25, 320, 640, 960, 1200, 1800, 2400] : [null],
    formats: ["jpeg", "webp"],
    urlPath: "/images",
    outputDir: "./_output/images",
  });

  let lowestSrc = stats["jpeg"][0];

  const srcset = Object.keys(stats).reduce(
    (acc, format) => ({
      ...acc,
      [format]: stats[format].reduce(
        (_acc, curr) => `${_acc} ${curr.srcset} ,`,
        "",
      ),
    }),
    {},
  );

  const source = `<source type="image/webp" srcset="${srcset["webp"]}" >`;

  const img = `<img
  loading="lazy"
  alt="${alt}"
  src="${lowestSrc.url}"
  sizes='(min-width: 1024px) 1024px, 100vw'
  srcset="${srcset["jpeg"]}"
  width="${lowestSrc.width}"
  height="${lowestSrc.height}"
  class="${klass}">`;

  return `<picture>${source} ${img}</picture>`;
};
