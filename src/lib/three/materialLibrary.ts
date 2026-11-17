import {
  BackSide,
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  Vector2,
  type Texture,
} from "three";
import type { MaterialCategory } from "@/types/scene";

export const NORMAL_MAPS = {
  plaster: "/textures/normals/plaster.webp",
  concrete: "/textures/normals/concrete.webp",
  stone: "/textures/normals/stone.webp",
  pavers: "/textures/normals/pavers.webp",
  wood: "/textures/normals/wood.webp",
  grass: "/textures/normals/grass.webp",
  leaves: "/textures/normals/leaves.webp",
  bark: "/textures/normals/bark.webp",
  water: "/textures/normals/water.webp",
  fabric: "/textures/normals/fabric.webp",
} as const;

export type NormalKey = keyof typeof NORMAL_MAPS;
export type NormalTextures = Record<NormalKey, Texture>;

type Spec = {
  category: MaterialCategory;
  /** Metres covered by one repeat of the normal map. */
  tile: number;
  create: (n: NormalTextures) => MeshStandardMaterial;
};

const std = (
  name: string,
  color: string,
  roughness: number,
  normal?: Texture,
  normalScale = 1,
  extra: Partial<MeshStandardMaterial> = {},
) => {
  const material = new MeshStandardMaterial({ name, color: new Color(color), roughness, metalness: 0 });
  if (normal) {
    material.normalMap = normal;
    material.normalScale = new Vector2(normalScale, normalScale);
  }
  Object.assign(material, extra);
  return material;
};

/**
 * Paintable groups each get their own instance so they can never leak into a
 * protected mesh, and so the exterior controller can address them independently.
 */
const paint = (name: string, color: string) => (n: NormalTextures) =>
  std(name, color, 0.86, n.plaster, 0.35, { envMapIntensity: 0.9 });

const SPECS = {
  paintWalls: { category: "paint", tile: 2.4, create: paint("Paint_Exterior_Walls", "#ece8e1") },
  paintColumns: { category: "paint", tile: 2.4, create: paint("Paint_Exterior_Columns", "#ece8e1") },
  paintRoof: { category: "paint", tile: 2.4, create: paint("Paint_Exterior_Roof", "#e4e0d8") },
  paintPanels: { category: "paint", tile: 2.4, create: paint("Paint_Decorative_Panels", "#ddd8cf") },
  paintGarage: { category: "paint", tile: 2.4, create: paint("Paint_Garage_Exterior", "#ece8e1") },

  glass: {
    category: "glass",
    tile: 4,
    create: () =>
      new MeshPhysicalMaterial({
        name: "Glass",
        color: new Color("#2a3a40"),
        roughness: 0.04,
        metalness: 0.1,
        transparent: true,
        opacity: 0.42,
        envMapIntensity: 1.6,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        depthWrite: false,
        side: DoubleSide,
      }),
  },
  mullion: { category: "metal", tile: 1, create: () => std("Metal_Mullion", "#2b2723", 0.38, undefined, 1, { metalness: 0.85 }) },
  railing: { category: "metal", tile: 1, create: () => std("Metal_Railing", "#2b2723", 0.32, undefined, 1, { metalness: 0.9 }) },
  fittings: { category: "metal", tile: 1, create: () => std("Metal_Fittings", "#3a3631", 0.4, undefined, 1, { metalness: 0.8 }) },
  garageDoor: { category: "metal", tile: 1.2, create: (n) => std("Metal_Garage_Door", "#36332f", 0.5, n.wood, 0.25, { metalness: 0.6 }) },

  woodDoor: { category: "wood", tile: 1.4, create: (n) => std("Wood_Main_Door", "#5e3f29", 0.55, n.wood, 0.7) },
  woodSoffit: { category: "wood", tile: 1.4, create: (n) => std("Wood_Soffit", "#8a6343", 0.62, n.wood, 0.6) },
  woodLouvre: { category: "wood", tile: 1.4, create: (n) => std("Wood_Louvres", "#6f4c33", 0.58, n.wood, 0.7) },

  stone: { category: "stone", tile: 1.8, create: (n) => std("Stone_Cladding", "#8c8479", 0.92, n.stone, 1.1) },
  coping: { category: "stone", tile: 2, create: (n) => std("Stone_Coping", "#d9d4cb", 0.7, n.plaster, 0.5) },
  concrete: { category: "concrete", tile: 3, create: (n) => std("Concrete_Plinth", "#a19c94", 0.88, n.concrete, 0.7) },

  terrace: { category: "paving", tile: 2.4, create: (n) => std("Paving_Terrace", "#bdb6aa", 0.82, n.pavers, 0.7) },
  driveway: { category: "paving", tile: 2, create: (n) => std("Paving_Driveway", "#57544f", 0.9, n.pavers, 0.9) },

  water: {
    category: "water",
    tile: 3.5,
    create: (n) => {
      const material = new MeshPhysicalMaterial({
        name: "Pool_Water",
        color: new Color("#3fa7bb"),
        roughness: 0.03,
        metalness: 0,
        transparent: true,
        opacity: 0.78,
        envMapIntensity: 1.4,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        normalMap: n.water,
        normalScale: new Vector2(0.35, 0.35),
      });
      return material;
    },
  },
  poolTile: { category: "water", tile: 1.2, create: (n) => std("Pool_Tile", "#8cc9d1", 0.35, n.pavers, 0.4, { side: BackSide }) },

  grass: { category: "vegetation", tile: 3, create: (n) => std("Garden_Lawn", "#4b5e33", 1, n.grass, 1) },
  hedge: { category: "vegetation", tile: 1.4, create: (n) => std("Garden_Hedge", "#33472a", 0.95, n.leaves, 1.4) },
  leaves: { category: "vegetation", tile: 1.6, create: (n) => std("Tree_Leaves", "#4a5f35", 0.9, n.leaves, 1.4) },
  leavesDark: { category: "vegetation", tile: 1.6, create: (n) => std("Tree_Leaves_Cypress", "#2a3b24", 0.95, n.leaves, 1.4) },
  bark: { category: "vegetation", tile: 1, create: (n) => std("Tree_Bark", "#4c3f33", 0.95, n.bark, 1) },

  cushion: { category: "fabric", tile: 0.6, create: (n) => std("Fabric_Cushion", "#e8e3d9", 0.95, n.fabric, 0.5) },
  furnitureFrame: { category: "metal", tile: 1, create: () => std("Metal_Furniture", "#2f2c29", 0.45, undefined, 1, { metalness: 0.7 }) },

  interiorWall: {
    category: "interior",
    tile: 3,
    create: () => std("Interior_Walls", "#d6cdbf", 0.9, undefined, 1, { side: BackSide, emissive: new Color("#ffcf96"), emissiveIntensity: 0 }),
  },
  interiorFloor: {
    category: "interior",
    tile: 1.6,
    create: (n) => std("Interior_Floor", "#9a7957", 0.6, n.wood, 0.5, { emissive: new Color("#ffcf96"), emissiveIntensity: 0 }),
  },
  interiorFurniture: {
    category: "interior",
    tile: 1,
    create: (n) => std("Interior_Furniture", "#47413a", 0.85, n.fabric, 0.4, { emissive: new Color("#ffcf96"), emissiveIntensity: 0 }),
  },

  lightWarm: {
    category: "light",
    tile: 1,
    create: () => std("Light_Warm", "#2a2620", 0.5, undefined, 1, { emissive: new Color("#ffd29a"), emissiveIntensity: 0 }),
  },
} satisfies Record<string, Spec>;

export type MaterialKey = keyof typeof SPECS;

export const PAINTABLE_KEYS: readonly MaterialKey[] = [
  "paintWalls",
  "paintColumns",
  "paintRoof",
  "paintPanels",
  "paintGarage",
];

export type MaterialLibrary = {
  get: (key: MaterialKey) => MeshStandardMaterial;
  category: (key: MaterialKey) => MaterialCategory;
  tile: (key: MaterialKey) => number;
  paintable: (key: MaterialKey) => boolean;
  /** Emissive materials driven by the lighting rig. */
  lights: MeshStandardMaterial[];
  interior: MeshStandardMaterial[];
  water: MeshPhysicalMaterial;
  /** Architectural lights (0–1) and interior glow (0–1), driven by the lighting rig. */
  setLightLevels: (lights: number, glow: number) => void;
  dispose: () => void;
};

export function prepareNormalTextures(textures: NormalTextures) {
  for (const texture of Object.values(textures)) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.colorSpace = NoColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }
}

export function createMaterialLibrary(normals: NormalTextures): MaterialLibrary {
  const cache = new Map<MaterialKey, MeshStandardMaterial>();
  for (const key of Object.keys(SPECS) as MaterialKey[]) {
    cache.set(key, SPECS[key].create(normals));
  }
  const get = (key: MaterialKey) => cache.get(key)!;
  const lights = [get("lightWarm")];
  const interior = [get("interiorWall"), get("interiorFloor"), get("interiorFurniture")];
  const poolTile = get("poolTile");
  poolTile.emissive.set("#2fb6d0");

  return {
    get,
    category: (key) => SPECS[key].category,
    tile: (key) => SPECS[key].tile,
    paintable: (key) => PAINTABLE_KEYS.includes(key),
    lights,
    interior,
    water: get("water") as MeshPhysicalMaterial,
    setLightLevels: (level, glow) => {
      for (const material of lights) material.emissiveIntensity = 0.15 + level * 5.5;
      for (const material of interior) material.emissiveIntensity = glow * 0.55;
      poolTile.emissiveIntensity = level * 0.9;
    },
    dispose: () => cache.forEach((material) => material.dispose()),
  };
}
