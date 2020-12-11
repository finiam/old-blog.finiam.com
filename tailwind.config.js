const plugin = require("tailwindcss/plugin");

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

const FONTS = {
  ".font-edgy": {
    fontFamily: "StudioFeixenSans-Edgy",
    fontFeatureSettings: `"smcp" 1, "onum" 1, "frac" 1, "kern" 1, "liga" 1, "dlig" 1, "swsh" 1`,
  },
  ".font-sans": {
    fontFamily: "StudioFeixenSans",
    fontFeatureSettings: `"ss01" 1`,
  },
  ".font-serif": {
    fontFamily: "RecifeText",
    fontFeatureSettings: `"ss01" 1`,
  },
  ".font-mono": {
    fontFamily: "'PT Mono', monospace",
    fontFeatureSettings: `"smcp" 1, "onum" 1, "frac" 1, "kern" 1, "liga" 1, "dlig" 1, "swsh" 1`,
  },
};

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
      sans: FONTS[".font-sans"].fontFamily,
      mono: FONTS[".font-mono"].fontFamily
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
      black: "#252525",
    },

    extend: {
      width: columns,
      maxWidth: columns,
      minWidth: columns,
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.black"),
            maxWidth: "none",
            "& > *": {
              maxWidth: columns["10-col"],
            },
            img: {
              maxWidth: columns["12-col"],
              width: columns["12-col"],
              marginTop: baseSpacing["64"],
              marginBottom: baseSpacing["64"],
            },
            figure: {
              maxWidth: columns["12-col"],
              width: columns["12-col"],
              marginTop: baseSpacing["64"],
              marginBottom: baseSpacing["64"],
            },
            iframe: {
              maxWidth: columns["12-col"],
              width: columns["12-col"],
              marginTop: baseSpacing["64"],
              marginBottom: baseSpacing["64"],
            },
            blockquote: {
              maxWidth: columns["12-col"],
              width: columns["12-col"],
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              borderLeftWidth: null,
              borderLeftColor: null,
              paddingLeft: null,
              marginTop: baseSpacing["64"],
              marginBottom: baseSpacing["64"],
              fontStyle: null,
            },
            "blockquote > p": {
              fontSize: theme("fontSize.xl")[0],
              lineHeight: theme("fontSize.xl")[1],
            },
            pre: {
              maxWidth: columns["12-col"],
              width: columns["12-col"],
              padding: baseSpacing["32"],
            },
            h1: {
              fontSize: theme("fontSize.3xl")[0],
              lineHeight: theme("fontSize.3xl")[1],
              color: theme("colors.black"),
              fontWeight: "500",
              ...FONTS[".font-edgy"],
            },
            h2: {
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1],
              color: theme("colors.black"),
              fontWeight: "500",
              ...FONTS[".font-edgy"],
            },
            h3: {
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1],
              color: theme("colors.black"),
              fontWeight: "500",
              ...FONTS[".font-edgy"],
            },
            h4: {
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1],
              color: theme("colors.black"),
              fontWeight: "500",
              ...FONTS[".font-edgy"],
            },
            h5: {
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1],
              color: theme("colors.black"),
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1],
              fontWeight: "500",
              ...FONTS[".font-edgy"],
            },
            h6: {
              fontSize: theme("fontSize.2xl")[0],
              lineHeight: theme("fontSize.2xl")[1],
              color: theme("colors.black"),
              fontWeight: "500",
              ...FONTS[".font-edgy"],
            },
            p: {
              fontSize: theme("fontSize.lg")[0],
              lineHeight: theme("fontSize.lg")[1],
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
            "pre code::after": null,
            "ul > li::before": {
              backgroundColor: theme("colors.black"),
            },
          },
        },
        center: {
          css: {
            "& > *": {
              margin: "0 auto",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography")({ modifiers: [null] }),
    plugin(function ({ addComponents }) {
      addComponents(FONTS);
    }),
  ],
};
