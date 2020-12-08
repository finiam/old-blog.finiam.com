const baseSpacing = { 4: "4px" };
for (let i = 0; i < 98; i += 2) {
  baseSpacing[i * 4] = `${i * 4}px`;
}
const column = 42;
const gutter = 28;
const baseColumns = Array(18)
  .fill()
  .reduce(
    (memo, _, index) => ({
      ...memo,
      [`${index + 1}-col`]: `${column * (index + 1) + gutter * index}px`,
    }),
    {},
  );
const columns = {
  ...baseColumns,
  "column-spacing": `${column + gutter * 2}px`,
  none: "none",
  0: "0",
  "1/2": "50%",
  "1/4": "25%",
  "3/4": "75%",
  full: "100%",
  screen: "100vw",
};

function responsivify(minSize, maxSize) {
  const minViewport = 320;
  const maxViewport = 1280;

  return `calc(${minSize}px + ${
    maxSize - minSize
  } *(100vw - ${minViewport}px)/${maxViewport})`;
}

module.exports = {
  purge: {
    mode: "all",
    content: [
      "./src/**/*.js",
      "./src/**/*.njk",
      "./src/**/*.liquid",
      "./src/**/*.ts",
      "./src/**/*.css",
    ],
  },

  theme: {
    fontFamily: {
      "title-rg": ["Sans-Regular"],
      "title-md": ["Sans-Medium"],
      "subtitle-rg": ["Sans-Regular-subtitles"],
      "serif-rg": ["Recife-Text"],
    },
    extend: {
      width: columns,
      maxWidth: columns,
      minWidth: columns,
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            img: {
              maxWidth: columns["12-col"],
            },
          },
        },
      },
    },
    spacing: {
      ...baseSpacing,
      gutter: `${gutter}px`,
      "column-spacing": columns["column-spacing"],
    },
    fontSize: {
      sm: ["14px", "20px"],
      base: [responsivify(14, 16), responsivify(18, 20)],
      lg: [responsivify(16, 20), responsivify(20, 32)],
      xl: [responsivify(20, 28), responsivify(28, 40)],
      "2xl": [responsivify(28, 40), responsivify(40, 52)],
      "3xl": [responsivify(40, 54), responsivify(52, 72)],
    },
    colors: {
      brand: "#4D00E5",
      gray: {
        dark: "#252525",
        DEFAULT: "#757575",
        light: "#DEDEDE",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
