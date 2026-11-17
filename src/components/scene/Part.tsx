"use client";

import { createContext, useContext, useMemo } from "react";
import type { Euler } from "@react-three/fiber";
import type { BufferGeometry } from "three";
import { worldBox } from "@/lib/three/geometry";
import type { MaterialKey, MaterialLibrary } from "@/lib/three/materialLibrary";
import type { PartGroup, PartTag } from "@/types/scene";

export const MaterialsContext = createContext<MaterialLibrary | null>(null);

export function useMaterials() {
  const library = useContext(MaterialsContext);
  if (!library) throw new Error("useMaterials must be used inside <MaterialsContext>");
  return library;
}

type Vec3 = [number, number, number];

type PartProps = {
  name: string;
  group: PartGroup;
  mat: MaterialKey;
  /** Box size in metres. Ignored when `geometry` is given. */
  size?: Vec3;
  geometry?: BufferGeometry;
  position?: Vec3;
  rotation?: Euler;
  scale?: Vec3;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

/**
 * One tagged mesh of the residence. Paint eligibility comes from the material
 * key (only paint materials are eligible), never from the mesh name.
 */
export function Part({
  name,
  group,
  mat,
  size,
  geometry,
  position,
  rotation,
  scale,
  castShadow = true,
  receiveShadow = true,
}: PartProps) {
  const library = useMaterials();
  const geo = useMemo(
    () => geometry ?? worldBox(size![0], size![1], size![2], library.tile(mat)),
    [geometry, size, library, mat],
  );
  const tag: PartTag = { group, category: library.category(mat), paintable: library.paintable(mat) };

  return (
    <mesh
      name={name}
      geometry={geo}
      material={library.get(mat)}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      userData={{ estateverse: tag }}
    />
  );
}

/** Helper: a box defined by its min/max corners, which reads more like a plan. */
export function span(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return {
    size: [x1 - x0, y1 - y0, z1 - z0] as Vec3,
    position: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] as Vec3,
  };
}
