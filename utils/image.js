const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const hash = require("./hash");

const CACHE = {};
const IMAGES_ROOT = "./static/"
const OUTPUT_PATH = "./_output/images/";
const URL_PATH = "/images/";

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

async function saveSharpImage(sharpImage, fileName) {
  if (fs.existsSync(fileName)) return;

  await sharpImage.toFile(fileName);
}

async function generateImage(sharpImage, fileName, width = null) {
  sharpImage.resize({
    width: width ? width : defaultImgWidth,
  });

  if (!fs.existsSync(OUTPUT_PATH))
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });

  await Promise.all([
    saveSharpImage(sharpImage, path.join(OUTPUT_PATH, `${fileName}.webp`)),
    saveSharpImage(sharpImage, path.join(OUTPUT_PATH, `${fileName}.jpeg`)),
  ]);
}

async function generateImages(inputPath, imageHash, responsive) {
  const sharpImage = await sharp(inputPath);
  const imageWidth = (await sharpImage.metadata()).width;
  const defaultImgWidth = imageWidth > 1280 ? 1280 : imageWidth;
  const widths = responsive ? [320, 480, 800, 1024, 1280] : [defaultImgWidth];

  await Promise.all(
    widths.map((width) =>
      generateImage(sharpImage, `${imageHash}-${width}`, width),
    ),
  );

  const placeholder = await sharp(inputPath)
    .resize({ width: 64 })
    .blur()
    .toBuffer();

  return {
    jpeg: {
      url: path.join(URL_PATH, `${imageHash}.jpeg`),
      srcset: widths
        .map(
          (width) =>
            `${path.join(URL_PATH, `${imageHash}-${width}.jpeg`)} ${width}w`,
        )
        .join(", "),
      sizes: widths
        .map((width) => `(max-width: ${width}px) ${width - 20}px`)
        .join(", "),
    },
    webp: {
      url: path.join(URL_PATH, `${imageHash}.webp`),
      srcset: widths
        .map(
          (width) =>
            `${path.join(URL_PATH, `${imageHash}-${width}.webp`)} ${width}w`,
        )
        .join(", "),
      sizes: widths
        .map((width) => `(max-width: ${width}px) ${width}px`)
        .join(", "),
    },
    placeholder: `data:image/png;base64,${placeholder.toString("base64")}`,
  };
}

module.exports = async (src, alt, klass, responsive = false) => {
  try {
    if (!alt) throw new Error(`Missing \`alt\` from: ${src}`);

    if (!src) return;

    if (process.env.NODE_ENV !== "production")
      return skipOptimization(src, alt, klass);

    const inputPath = path.join(IMAGES_ROOT, src);
    const imageHash = (await hash(inputPath)).slice(0, 20);
    let imageStats = CACHE[imageHash];

    if (!imageStats) {
      imageStats = await generateImages(inputPath, imageHash, responsive);
      CACHE[hash] = imageStats;
    }

    return `
<picture>
<source type="image/webp" data-srcset="${imageStats.webp.srcset}" sizes="100vw">
<img
alt="${alt}"
src="${imageStats.placeholder}"
data-src="${imageStats.jpeg.url}"
data-srcset="${imageStats.jpeg.srcset}"
data-sizes="${imageStats.jpeg.sizes}"
class="lazy ${klass}">
</picture>

<noscript>
<picture>
<source type="image/webp" srcset="${imageStats.webp.url}" sizes="100vw">
<img
loading="lazy"
alt="${alt}"
src="${imageStats.jpeg.url}"
sizes="(min-width: 1024px) 1024px, 100vw"
class="${klass}">
</picture>
</noscript>
  `;
  } catch (error) {
    console.error(`Error on ${src}`);

    throw error;
  }
};
