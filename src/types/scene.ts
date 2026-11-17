export const LIGHTING_MODES = ["daylight", "sunset", "night"] as const;
export type LightingMode = (typeof LIGHTING_MODES)[number];

/** Asset hierarchy, mirrored by the named groups in the scene graph. */
export type PaintableGroup =
  | "Exterior_Walls"
  | "Exterior_Columns"
  | "Exterior_Roof"
  | "Decorative_Panels"
  | "Garage_Exterior";

export type ProtectedGroup =
  | "Windows"
  | "Glass_Doors"
  | "Main_Door"
  | "Wood_Details"
  | "Railings"
  | "Exterior_Fittings"
  | "Stone_Features"
  | "Plinth"
  | "Pool"
  | "Garden"
  | "Trees"
  | "Driveway"
  | "Terrace"
  | "Outdoor_Furniture"
  | "Exterior_Lighting"
  | "Interior";

export type PartGroup = PaintableGroup | ProtectedGroup;

export type MaterialCategory =
  | "paint"
  | "glass"
  | "wood"
  | "metal"
  | "stone"
  | "concrete"
  | "paving"
  | "water"
  | "vegetation"
  | "fabric"
  | "interior"
  | "light";

/** Metadata stored on every tagged mesh as `mesh.userData.estateverse`. */
export type PartTag = {
  group: PartGroup;
  category: MaterialCategory;
  paintable: boolean;
};

export type ExteriorMaterialEntry = {
  meshId: string;
  meshName: string;
  materialId: string;
  group: PartGroup;
  category: MaterialCategory;
  originalColor: string;
  paintable: boolean;
};

export type RegistrySummary = {
  paintableMeshes: number;
  protectedMeshes: number;
  paintableMaterials: number;
  groups: { group: PartGroup; meshes: number; paintable: boolean }[];
};

export type RenderTier = "low" | "balanced" | "high";
