# Finiam Blog Website

A basic Eleventy app powered by Snowpack.

Just place `liquid` (templating language used by Shopify) or `md` files under `src` and they will get turn into HTML pages by Eleventy.

Write Javascript and CSS under `src/assets`. Avoid CSS though and use Tailwind, compiles will be slow everytime you update the CSS.

## Available Scripts

### bin/setup

Provided you have ASDF, this script will set everything up.

### bin/server

Runs the development server

### bin/lint

Lints all JS and CSS code.

### bin/build

Builds the static site and outputs it on `build`

## Project structure

### `assets`

This is where you place custom JS and CSS to run alongside the website. This is processed by `snowpack` which during production bundles everything with `esbuild`, except the `css` which is built by `postcss`. Remember, this is a `tailwind` project so custom CSS should be used sparingly.

### `site`

The website. This directory is processed by `eleventy`. Under this directory you can place your data under `_data` and your re-usable templates under `_includes`. The rest of the files are just processed into HTML using `eleventy`.

### `static`

Everything under `static` just gets copied to the final build output as is. Except the images that are imported with our custom shortcode. Those go under `optimized_images`.

### `utils`

Stuff for the `eleventy` config.

Preview
