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
      entrypoints: ["assets/scripts/index.js"],
      bundle: true,
      minify: true,
      target: "es2017",
    },
  },
};
