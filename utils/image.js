const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const hash = require("./hash");

const CACHE = {};
const IMAGES_ROOT = "./static/";
const DOWNLOAD_PATH = "./_output/downloaded_images/";
const OUTPUT_PATH = "./_output/optimized_images/";
const URL_PATH = "/optimized_images/";

if (!fs.existsSync(DOWNLOAD_PATH))
  fs.mkdirSync(DOWNLOAD_PATH, { recursive: true });
if (!fs.existsSync(OUTPUT_PATH)) fs.mkdirSync(OUTPUT_PATH, { recursive: true });

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

  await Promise.all([
    saveSharpImage(sharpImage, path.join(OUTPUT_PATH, `${fileName}.avif`)),
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
    avif: {
      url: path.join(URL_PATH, `${imageHash}.avif`),
      srcset: widths
        .map(
          (width) =>
            `${path.join(URL_PATH, `${imageHash}-${width}.avif`)} ${width}w`,
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

    if (process.env.NODE_ENV !== "production") {
      return skipOptimization(src, alt, klass);
    }

    let inputPath;

    // Download image if it's remote
    if (src.startsWith("https://") || src.startsWith("http://")) {
      const url = new URL(src);
      const response = await fetch(src);
      const buffer = await response.buffer();
      inputPath = path.join(DOWNLOAD_PATH, url.pathname.replace(/\//g, "-"));

      // Skip if file is already downloaded
      if (!fs.existsSync(inputPath)) fs.writeFileSync(inputPath, buffer);
    }
    // Set the input path to the static images folder if it's not remote
    else inputPath = path.join(IMAGES_ROOT, src);

    const imageHash = (await hash(inputPath)).slice(0, 20);
    let imageStats = CACHE[imageHash];

    if (!imageStats) {
      imageStats = await generateImages(inputPath, imageHash, responsive);
      CACHE[hash] = imageStats;
    }

    return `
<picture>
<source type="image/avif" data-srcset="${imageStats.avif.srcset}" data-sizes="${imageStats.avif.sizes}">
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
<source type="image/avif" srcset="${imageStats.avif.srcset}" sizes="${imageStats.avif.sizes}">
<img
loading="lazy"
alt="${alt}"
src="${imageStats.jpeg.url}"
srcset="${imageStats.jpeg.srcset}"
sizes="${imageStats.jpeg.sizes}"
class="${klass}">
</picture>
</noscript>
  `;
  } catch (error) {
    console.error(`Error on ${src}`);

    throw error;
  }
};
