"use client";

import { useMemo } from "react";
import { foliage, worldCylinder } from "@/lib/three/geometry";
import { Part, span, useMaterials } from "./Part";

type TreeKind = "cypress" | "olive" | "canopy";

type TreeSpec = { kind: TreeKind; x: number; z: number; size: number; seed: number };

function Tree({ kind, x, z, size, seed, index }: TreeSpec & { index: number }) {
  const library = useMaterials();
  const shape = useMemo(() => {
    if (kind === "cypress") return { trunk: 1.2 * size, radius: 0.12 * size, canopy: [0.9 * size, 4.2 * size, 0.9 * size] as const, lift: 4.6 * size };
    if (kind === "olive") return { trunk: 1.8 * size, radius: 0.16 * size, canopy: [2.1 * size, 1.5 * size, 2.1 * size] as const, lift: 3.0 * size };
    return { trunk: 3 * size, radius: 0.22 * size, canopy: [2.8 * size, 2.4 * size, 2.8 * size] as const, lift: 4.8 * size };
  }, [kind, size]);
  const trunk = worldCylinder(shape.radius, shape.trunk, library.tile("bark"), 10);

  return (
    <group name={`Tree_${index}`} position={[x, 0, z]} rotation={[0, seed, 0]}>
      <Part name={`Tree_${index}_Trunk`} group="Trees" mat="bark" geometry={trunk} position={[0, shape.trunk / 2, 0]} />
      <Part
        name={`Tree_${index}_Canopy`}
        group="Trees"
        mat={kind === "cypress" ? "leavesDark" : "leaves"}
        geometry={foliage(seed % 7, kind === "cypress" ? 0.1 : 0.24)}
        position={[0, shape.lift, 0]}
        scale={[...shape.canopy]}
      />
      {kind !== "cypress" ? (
        <Part
          name={`Tree_${index}_Canopy_2`}
          group="Trees"
          mat="leaves"
          geometry={foliage((seed + 3) % 7, 0.26)}
          position={[shape.canopy[0] * 0.45, shape.lift - shape.canopy[1] * 0.25, -shape.canopy[2] * 0.3]}
          scale={[shape.canopy[0] * 0.65, shape.canopy[1] * 0.7, shape.canopy[2] * 0.65]}
        />
      ) : null}
    </group>
  );
}

const TREES: TreeSpec[] = [
  // Cypress screen behind the residence
  ...Array.from({ length: 13 }, (_, i) => ({ kind: "cypress" as const, x: -24 + i * 3.6, z: -14 - (i % 2) * 0.8, size: 1 + ((i * 37) % 5) * 0.06, seed: i + 1 })),
  { kind: "olive", x: -6.5, z: 13.2, size: 1, seed: 2 },
  { kind: "olive", x: 27, z: -12, size: 1.1, seed: 5 },
  { kind: "canopy", x: -24, z: 9, size: 1.1, seed: 3 },
  { kind: "canopy", x: -26, z: 22, size: 1.25, seed: 4 },
  { kind: "canopy", x: 33, z: -13, size: 1.2, seed: 6 },
  { kind: "canopy", x: 30, z: 18, size: 1, seed: 1 },
  // Distant woodland ring for depth; fog softens it into the horizon.
  ...Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2 + 0.3;
    const radius = 84 + ((i * 53) % 7) * 4;
    return { kind: "canopy" as const, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius - 4, size: 1.6 + ((i * 29) % 5) * 0.15, seed: i + 10 };
  }),
];

function Lounger({ x, index }: { x: number; index: number }) {
  const z = 15.7;
  const y = 0.3;
  return (
    <group name={`Lounger_${index}`}>
      <Part name={`Lounger_${index}_Frame`} group="Outdoor_Furniture" mat="furnitureFrame" {...span(x - 0.36, x + 0.36, y + 0.18, y + 0.24, z - 0.3, z + 1.6)} />
      {[-0.3, 1.5].map((dz, i) => (
        <Part key={i} name={`Lounger_${index}_Leg_${i}`} group="Outdoor_Furniture" mat="furnitureFrame" {...span(x - 0.34, x + 0.34, y, y + 0.18, z + dz, z + dz + 0.06)} />
      ))}
      <Part name={`Lounger_${index}_Cushion`} group="Outdoor_Furniture" mat="cushion" {...span(x - 0.33, x + 0.33, y + 0.24, y + 0.34, z + 0.3, z + 1.6)} />
      <Part
        name={`Lounger_${index}_Back`}
        group="Outdoor_Furniture"
        mat="cushion"
        size={[0.66, 0.1, 0.75]}
        position={[x, y + 0.55, z - 0.02]}
        rotation={[0.75, 0, 0]}
      />
    </group>
  );
}

function OutdoorDining() {
  const cx = 10.6;
  const cz = 1.2;
  return (
    <group name="Outdoor_Dining">
      <Part name="Dining_Top" group="Outdoor_Furniture" mat="woodSoffit" {...span(cx - 0.5, cx + 0.5, 1.02, 1.07, cz - 1.2, cz + 1.2)} />
      <Part name="Dining_Leg_A" group="Outdoor_Furniture" mat="furnitureFrame" {...span(cx - 0.05, cx + 0.05, 0.3, 1.02, cz - 0.9, cz - 0.8)} />
      <Part name="Dining_Leg_B" group="Outdoor_Furniture" mat="furnitureFrame" {...span(cx - 0.05, cx + 0.05, 0.3, 1.02, cz + 0.8, cz + 0.9)} />
      {[-0.7, 0, 0.7].flatMap((dz) => [-0.85, 0.85].map((dx) => [dx, dz] as const)).map(([dx, dz], i) => (
        <group key={i}>
          <Part name={`Dining_Chair_${i}_Seat`} group="Outdoor_Furniture" mat="cushion" {...span(cx + dx - 0.22, cx + dx + 0.22, 0.72, 0.8, cz + dz - 0.22, cz + dz + 0.22)} />
          <Part name={`Dining_Chair_${i}_Base`} group="Outdoor_Furniture" mat="furnitureFrame" {...span(cx + dx - 0.18, cx + dx + 0.18, 0.3, 0.72, cz + dz - 0.18, cz + dz + 0.18)} />
        </group>
      ))}
    </group>
  );
}

export function EnvironmentScene() {
  return (
    <group name="ENVIRONMENT">
      <group name="Garden">
        <Part name="Lawn" group="Garden" mat="grass" {...span(-140, 140, -0.05, 0, -140, 140)} castShadow={false} />
        <Part name="Hedge_Terrace" group="Garden" mat="hedge" {...span(-4, 22, 0, 0.9, 17.4, 18.2)} />
        <Part name="Hedge_Drive" group="Garden" mat="hedge" {...span(-8.3, -7.6, 0, 0.8, 11.8, 34)} />
        <Part name="Hedge_Side" group="Garden" mat="hedge" {...span(22.4, 23.2, 0, 0.9, -6, 17)} />
        {[
          [-3.6, 11.6, 0.7],
          [-3.4, 15.2, 0.55],
          [-9.6, 8.4, 0.6],
          [21.2, -7, 0.65],
        ].map(([x, z, s], i) => (
          <Part key={i} name={`Shrub_${i}`} group="Garden" mat="hedge" geometry={foliage(i + 2, 0.18)} position={[x, s * 0.7, z]} scale={[s * 1.3, s, s * 1.3]} />
        ))}
      </group>

      <group name="Terrace">
        <Part name="Terrace_Front" group="Terrace" mat="terrace" {...span(-4.45, 22, 0, 0.3, 6, 10.5)} />
        <Part name="Terrace_Pool_L" group="Terrace" mat="terrace" {...span(-4.45, 5, 0, 0.3, 10.5, 14.5)} />
        <Part name="Terrace_Pool_R" group="Terrace" mat="terrace" {...span(19, 22, 0, 0.3, 10.5, 14.5)} />
        <Part name="Terrace_Back" group="Terrace" mat="terrace" {...span(-4.45, 22, 0, 0.3, 14.5, 17.2)} />
        <Part name="Terrace_Side" group="Terrace" mat="terrace" {...span(9.2, 22, 0, 0.3, -6.2, 6)} />
      </group>

      <group name="Pool">
        <Part name="Pool_Basin" group="Pool" mat="poolTile" {...span(5, 19, -1.6, 0.3, 10.5, 14.5)} castShadow={false} />
        <Part name="Pool_Water" group="Pool" mat="water" {...span(5, 19, 0.12, 0.2, 10.5, 14.5)} castShadow={false} />
        <Part name="Pool_Coping_N" group="Pool" mat="coping" {...span(4.6, 19.4, 0.3, 0.34, 10.1, 10.5)} />
        <Part name="Pool_Coping_S" group="Pool" mat="coping" {...span(4.6, 19.4, 0.3, 0.34, 14.5, 14.9)} />
        <Part name="Pool_Coping_W" group="Pool" mat="coping" {...span(4.6, 5, 0.3, 0.34, 10.5, 14.5)} />
        <Part name="Pool_Coping_E" group="Pool" mat="coping" {...span(19, 19.4, 0.3, 0.34, 10.5, 14.5)} />
      </group>

      <group name="Driveway">
        <Part name="Driveway_Main" group="Driveway" mat="driveway" {...span(-17.2, -8.6, -0.02, 0.03, 5, 60)} castShadow={false} />
        <Part name="Entrance_Path" group="Driveway" mat="terrace" {...span(-8.6, -5.6, -0.02, 0.04, 7.4, 11.4)} castShadow={false} />
      </group>

      <group name="Trees">
        {TREES.map((tree, i) => (
          <Tree key={i} index={i} {...tree} />
        ))}
      </group>

      <group name="Outdoor_Furniture">
        {[7.2, 9.6, 12, 14.4].map((x, i) => (
          <Lounger key={i} x={x} index={i} />
        ))}
        <OutdoorDining />
      </group>

      <group name="Exterior_Lighting">
        {[12, 18, 24, 30].map((z, i) => (
          <group key={i}>
            <Part name={`Bollard_${i}`} group="Exterior_Lighting" mat="fittings" {...span(-8.95, -8.75, 0, 0.75, z, z + 0.2)} />
            <Part name={`Bollard_${i}_Lens`} group="Exterior_Lighting" mat="lightWarm" {...span(-8.96, -8.74, 0.55, 0.68, z - 0.01, z + 0.21)} castShadow={false} />
          </group>
        ))}
      </group>
    </group>
  );
}
