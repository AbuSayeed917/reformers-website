/** Canonical identity; both React components and SVG exports use this geometry. */
export const brand = {
  wordmark: { stem: "reformer", punctuation: "'", suffix: "S" },
  tagline: "Always a better way.",
  mark: {
    viewBox: "0 0 320 340",
    parts: [
      { id: "stem", path: "M56 108h64v176H56z" },
      {
        id: "shoulder",
        path: "M132 108c0-44 36-76 80-76h52v64h-52c-10 0-16 4-16 12v40h-64z",
      },
      { id: "baseline", path: "M56 296h64v24H56z" },
    ],
  },
} as const;

export const brandName = `${brand.wordmark.stem}${brand.wordmark.punctuation}${brand.wordmark.suffix}`;
