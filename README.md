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
