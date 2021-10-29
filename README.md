# Finiam Blog Website

A `svelte-kit` repo to give us the best experience possible in crafting a wonderful reading experience for our blog. This repo will also be used to build our entire website in the future.

## Available Scripts

### yarn dev

Runs a hot reloading development server on `localhost:3000`

### yarn lint

Lints all JS and CSS code with Prettier and ESLint.

### yarn format

Formats all JS and CSS code with Prettier and ESLint.

### yarn build

Produces a production ready build using Netlify adapter.

### yarn preview

Previews the production build using Node.js (not Netlify).

## Project structure

We follow a unmodified `svelte-kit` repo. Please check [their docs](https://kit.svelte.dev/docs) for more info.

Only difference we have to a regular `svelte-kit` repo is the presence of Tailwind, which maps to our Figma design guidelines.

We also use the `@sveltejs/adapter-netlify`. During the `build` phase, we produce a `Netlify` compatible build that uses `Netlify Functions` to render the page. We use agressive `s-maxage` caching to reduce function execution. If a `Netlify Function` returns a `s-maxage` their CDN caches the result during the mentioned time.
