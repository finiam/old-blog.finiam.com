const isProd = process.env.NODE_ENV === "production";

module.exports = {
  plugins: [
    isProd &&
      require("postcss-import")({
        resolve: (id, basedir, importOptions) => {
          return "assets/styles/" + id;
        },
      }),
    isProd && require("autoprefixer"),
    require("tailwindcss"),
    isProd && require("cssnano"),
  ].filter((plugin) => !!plugin),
};
