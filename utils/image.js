const Image = require("@11ty/eleventy-img");
Image.concurrency = 1;
const sharp = require("sharp");

async function skipOptimization(src, alt, klass) {
  return `
<picture>
<img
alt="${alt}"
src="${src}"
class="${klass}">
</picture>`;
}

module.exports = async (src, alt, klass, responsive = false) => {
  if (!alt) throw new Error(`Missing \`alt\` from: ${src}`);

  if (!src) return;

  const path = `./static/${src}`;

  if (!process.env.EXPERIMENTAL_IMAGE_OPTIMIZATION) return skipOptimization(src, alt, klass);

  let stats = await Image(path, {
    widths: responsive ? [25, 320, 640, 960, 1200, 1800, 2400] : [null],
    formats: ["jpeg", "webp"],
    urlPath: "/images",
    outputDir: "./_output/images",
  });
  let lowestSrc = stats["jpeg"][0];
  const placeholder = await sharp(lowestSrc.outputPath)
    .resize({ fit: sharp.fit.inside })
    .blur()
    .toBuffer();
  const base64Placeholder = `data:image/png;base64,${placeholder.toString(
    "base64",
  )}`;

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

  // DO NOT IDENT THIS PLEASE OTHERWHISE IT WILL BREAK
  // A LIMTATION FROM MARKDOWN-IT
  return `
<picture>
<source type="image/webp" data-srcset="${srcset["webp"]}">
<img
alt="${alt}"
src="${base64Placeholder}"
data-src="${lowestSrc.url}"
data-sizes="(min-width: 1024px) 1024px, 100vw"
data-srcset="${srcset["jpeg"]}"
class="lazy ${klass}">
</picture>

<noscript>
<picture>
<source type="image/webp" srcset="${srcset["webp"]}">
<img
loading="lazy"
alt="${alt}"
src="${lowestSrc.url}"
sizes="(min-width: 1024px) 1024px, 100vw"
srcset="${srcset["jpeg"]}"
width="${lowestSrc.width}"
height="${lowestSrc.height}"
class="${klass}">
</picture>
</noscript>
  `;
};
