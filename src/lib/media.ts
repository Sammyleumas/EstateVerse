/**
 * Architectural photography used outside the 3D scene.
 * Source: Unsplash (Unsplash License — free for commercial use, no attribution required).
 * Served through next/image, which resizes and converts to AVIF/WebP.
 */
export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const unsplash = (id: string) => `https://images.unsplash.com/${id}`;

export const media = {
  heroDusk: {
    src: unsplash("photo-1600596542815-ffad4c1539a9"),
    alt: "Contemporary two-storey residence at dusk with warm interior lighting behind large glass walls",
    width: 3000,
    height: 2000,
  },
  poolFacade: {
    src: unsplash("photo-1613490493576-7fde63acd811"),
    alt: "Minimalist white villa with flat roofs reflected in a swimming pool",
    width: 3000,
    height: 2000,
  },
  frontElevation: {
    src: unsplash("photo-1600585154340-be6161a56a0c"),
    alt: "Front elevation of a modern home with clean horizontal lines and a landscaped lawn",
    width: 3000,
    height: 2000,
  },
  terracePool: {
    src: unsplash("photo-1512917774080-9991f1c4c750"),
    alt: "White contemporary house with a terrace opening onto a pool",
    width: 3000,
    height: 2000,
  },
  modernExterior: {
    src: unsplash("photo-1580587771525-78b9dba3b914"),
    alt: "Modern residence with a stone and white render facade and a wide driveway",
    width: 3000,
    height: 2000,
  },
} satisfies Record<string, MediaAsset>;
