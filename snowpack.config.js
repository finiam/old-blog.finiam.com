const glob = require("glob");

module.exports = {
  mount: {
    _output: { url: '/', static: true },
    static: { url: '/', static: true },
    assets: "/assets",
  },
  plugins: [
    "@snowpack/plugin-postcss",
    [
      "@snowpack/plugin-run-script",
      { cmd: "eleventy", watch: "$1 --watch --quiet" },
    ],
  ],
  devOptions: {
    open: "none",
    hmrDelay: 500,
  },
  optimize: {
    // skip css
    entrypoints: glob.sync("assets/**/*.js"),
    bundle: true,
    minify: true,
    target: "es2017",
  },
};
