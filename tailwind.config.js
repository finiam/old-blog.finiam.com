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
    extend: {
      width: columns,
      maxWidth: columns,
      minWidth: columns,
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            "*": {
              maxWidth: columns["10-col"],
            },
            figure: {
              maxWidth: columns["12-col"],
            },
            blockquote: {
              maxWidth: columns["12-col"],
            },
            pre: {
              maxWidth: columns["12-col"],
              padding: baseSpacing["32"],
            },
            h1: {
              fontSize: responsivify(40, 54),
              lineHeight: responsivify(52, 72),
            },
            h2: {
              fontSize: responsivify(28, 40),
              lineHeight: responsivify(40, 52),
            },
            h3: {
              fontSize: responsivify(20, 28),
              lineHeight: responsivify(28, 40),
            },
            h4: {
              fontSize: responsivify(20, 28),
              lineHeight: responsivify(28, 40),
            },
            h5: {
              fontSize: responsivify(20, 28),
              lineHeight: responsivify(28, 40),
            },
            h6: {
              fontSize: responsivify(20, 28),
              lineHeight: responsivify(28, 40),
            },
            p: {
              fontSize: responsivify(16, 20),
              lineHeight: responsivify(20, 32),
            },
            a: {
              color: "#4D00E5",
              "text-decoration": "none",
              "&:hover": {
                "text-decoration": "underline",
              },
            },
            "code::before": null,
            "code::after": null,
            blockquote: { quotes: null },
            "blockquote p:first-of-type::before": null,
            "blockquote p:last-of-type::after": null,
            "pre code::after": null,
          },
        },
        center: {
          css: {
            "*": {
              margin: "0 auto",
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
        DEFAULT: "#757575",
        light: "#DEDEDE",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
