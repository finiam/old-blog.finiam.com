module.exports = {
  mount: {
    _output: "/",
    static: "/",
    assets: "/assets",
  },
  plugins: [
    "@snowpack/plugin-postcss",
    ["@snowpack/plugin-run-script", { cmd: "eleventy", watch: "$1 --watch" }],
  ],
  devOptions: {
    open: "none",
    hmrDelay: 500,
  },
  optimize: {
    bundle: true,
    minify: true,
    target: "es2017",
  },
};
