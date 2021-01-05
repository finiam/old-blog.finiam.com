module.exports = {
  mount: {
    _output: "/",
    static: "/",
    "src/assets": "/assets",
  },
  plugins: [
    "@snowpack/plugin-postcss",
    ["@snowpack/plugin-run-script", { cmd: "eleventy", watch: "$1 --watch" }],
  ],
  devOptions: {
    open: "none",
    hmrDelay: 500,
  },
  experiments: {
    optimize: {
      // We need to manually import these otherwise the optimize step
      // will pick up CSS and we DON'T WANT THAT
      entrypoints: [
        "assets/scripts/index.js",
        "assets/scripts/lazyload.js",
        "assets/scripts/instantpage.js",
      ],
      bundle: true,
      minify: true,
      target: "es2017",
    },
  },
};
