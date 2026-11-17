"use client";

import { Part, span } from "./Part";

/*
 * Signature residence, built at real scale (metres). Front facade faces +z.
 *
 *   Ground floor  x -9…9,   z -6…6,    y 0.3…3.9
 *   Upper floor   x -6…12,  z -5…7.5,  y 4.37…7.65  (cantilevers over the terrace)
 *   Garage wing   x -16.6…-9, z -4.8…5
 *
 * Scene graph mirrors the asset hierarchy:
 * ESTATEVERSE_MANSION › BUILDING_STRUCTURE | GLASS_SYSTEM | WOOD_SYSTEM | METAL_SYSTEM | STONE_SYSTEM | INTERIOR
 */

const GF = { y0: 0.3, y1: 3.9 };
const UF = { y0: 4.37, y1: 7.65 };

/** Evenly spaced positions between a and b, inclusive. */
const steps = (a: number, b: number, count: number) =>
  Array.from({ length: count + 1 }, (_, i) => a + ((b - a) * i) / count);

function GlassRun({
  name,
  group,
  axis,
  from,
  to,
  fixed,
  y0,
  y1,
  bays,
}: {
  name: string;
  group: "Windows" | "Glass_Doors";
  axis: "x" | "z";
  from: number;
  to: number;
  fixed: number;
  y0: number;
  y1: number;
  bays: number;
}) {
  const pane = axis === "x" ? span(from, to, y0, y1, fixed - 0.02, fixed + 0.02) : span(fixed - 0.02, fixed + 0.02, y0, y1, from, to);
  return (
    <>
      <Part name={`${name}_Glass`} group={group} mat="glass" {...pane} castShadow={false} />
      {steps(from, to, bays).map((p, i) => {
        const m = axis === "x" ? span(p - 0.04, p + 0.04, y0, y1, fixed - 0.06, fixed + 0.06) : span(fixed - 0.06, fixed + 0.06, y0, y1, p - 0.04, p + 0.04);
        return <Part key={i} name={`${name}_Mullion_${i}`} group="Exterior_Fittings" mat="mullion" {...m} />;
      })}
      {/* head and sill frames */}
      <Part
        name={`${name}_Head`}
        group="Exterior_Fittings"
        mat="mullion"
        {...(axis === "x" ? span(from, to, y1 - 0.06, y1, fixed - 0.06, fixed + 0.06) : span(fixed - 0.06, fixed + 0.06, y1 - 0.06, y1, from, to))}
      />
      <Part
        name={`${name}_Sill`}
        group="Exterior_Fittings"
        mat="mullion"
        {...(axis === "x" ? span(from, to, y0, y0 + 0.05, fixed - 0.06, fixed + 0.06) : span(fixed - 0.06, fixed + 0.06, y0, y0 + 0.05, from, to))}
      />
    </>
  );
}

function BuildingStructure() {
  return (
    <group name="BUILDING_STRUCTURE">
      <group name="Exterior_Walls">
        {/* Ground floor */}
        <Part name="GF_Wall_Rear_Low" group="Exterior_Walls" mat="paintWalls" {...span(-9, 9, GF.y0, 1.2, -6, -5.7)} />
        <Part name="GF_Wall_Rear_High" group="Exterior_Walls" mat="paintWalls" {...span(-9, 9, 3.2, GF.y1, -6, -5.7)} />
        <Part name="GF_Wall_Rear_L" group="Exterior_Walls" mat="paintWalls" {...span(-9, -6, 1.2, 3.2, -6, -5.7)} />
        <Part name="GF_Wall_Rear_R" group="Exterior_Walls" mat="paintWalls" {...span(6, 9, 1.2, 3.2, -6, -5.7)} />
        <Part name="GF_Wall_Left" group="Exterior_Walls" mat="paintWalls" {...span(-9, -8.7, GF.y0, GF.y1, -5.7, 6)} />
        <Part name="GF_Wall_Front_A" group="Exterior_Walls" mat="paintWalls" {...span(-9, -7.8, GF.y0, GF.y1, 5.7, 6)} />
        <Part name="GF_Wall_Front_Door_Head" group="Exterior_Walls" mat="paintWalls" {...span(-7.8, -6.2, 3.5, GF.y1, 5.7, 6)} />
        <Part name="GF_Wall_Front_B" group="Exterior_Walls" mat="paintWalls" {...span(-6.2, -4.9, GF.y0, GF.y1, 5.7, 6)} />
        <Part name="GF_Wall_Right" group="Exterior_Walls" mat="paintWalls" {...span(8.7, 9, GF.y0, GF.y1, -6, -3)} />

        {/* Upper floor */}
        <Part name="UF_Wall_Front_L" group="Exterior_Walls" mat="paintWalls" {...span(-6, -5.6, UF.y0, UF.y1, 5.6, 7.5)} />
        <Part name="UF_Loggia_Side_R" group="Exterior_Walls" mat="paintWalls" {...span(-0.8, -0.5, UF.y0, UF.y1, 5.6, 7.2)} />
        <Part name="UF_Wall_Front_Pier" group="Exterior_Walls" mat="paintWalls" {...span(-0.8, 0.4, UF.y0, UF.y1, 7.2, 7.5)} />
        <Part name="UF_Wall_Front_R" group="Exterior_Walls" mat="paintWalls" {...span(11.6, 12, UF.y0, UF.y1, 7.2, 7.5)} />
        <Part name="UF_Wall_Side_R" group="Exterior_Walls" mat="paintWalls" {...span(11.7, 12, UF.y0, UF.y1, -5, 7.2)} />
        <Part name="UF_Wall_Side_L" group="Exterior_Walls" mat="paintWalls" {...span(-6, -5.7, UF.y0, UF.y1, -5, 5.6)} />
        <Part name="UF_Wall_Rear_Low" group="Exterior_Walls" mat="paintWalls" {...span(-6, 12, UF.y0, 5.2, -5, -4.7)} />
        <Part name="UF_Wall_Rear_High" group="Exterior_Walls" mat="paintWalls" {...span(-6, 12, 7.0, UF.y1, -5, -4.7)} />
        <Part name="UF_Wall_Rear_L" group="Exterior_Walls" mat="paintWalls" {...span(-6, -3, 5.2, 7.0, -5, -4.7)} />
        <Part name="UF_Wall_Rear_R" group="Exterior_Walls" mat="paintWalls" {...span(9, 12, 5.2, 7.0, -5, -4.7)} />
      </group>

      <group name="Exterior_Columns">
        {[
          [11.5, 7.2],
          [11.5, -4.3],
          [4.6, 7.2],
        ].map(([x, z], i) => (
          <Part key={i} name={`Column_${i}`} group="Exterior_Columns" mat="paintColumns" {...span(x - 0.16, x + 0.16, GF.y0, 3.86, z - 0.16, z + 0.16)} />
        ))}
      </group>

      <group name="Exterior_Roof">
        <Part name="GF_Roof_Slab" group="Exterior_Roof" mat="paintRoof" {...span(-9.3, 9.3, GF.y1, 4.35, -6.3, 6.3)} />
        <Part name="UF_Roof_Slab" group="Exterior_Roof" mat="paintRoof" {...span(-6.3, 12.3, UF.y1, 8.0, -5.3, 7.8)} />
        <Part name="Garage_Roof_Slab" group="Exterior_Roof" mat="paintRoof" {...span(-16.9, -8.9, 3.7, 4.0, -5.1, 5.3)} />
      </group>

      <group name="Decorative_Panels">
        {/* Floor slab of the cantilevered upper volume, read as a continuous fascia band */}
        <Part name="UF_Floor_Fascia" group="Decorative_Panels" mat="paintPanels" {...span(-6, 12.3, 3.88, 4.37, -5, 7.8)} />
        {/* Entrance portal frame */}
        <Part name="Entrance_Portal" group="Decorative_Panels" mat="paintPanels" {...span(-8.0, -6.0, 3.5, 3.62, 6, 6.6)} />
      </group>

      <group name="Garage_Exterior">
        <Part name="Garage_Wall_Rear" group="Garage_Exterior" mat="paintGarage" {...span(-16.6, -9, 0, 3.7, -4.8, -4.5)} />
        <Part name="Garage_Wall_Left" group="Garage_Exterior" mat="paintGarage" {...span(-16.6, -16.3, 0, 3.7, -4.5, 5)} />
        <Part name="Garage_Wall_Front_L" group="Garage_Exterior" mat="paintGarage" {...span(-16.6, -15.8, 0, 3.7, 4.7, 5)} />
        <Part name="Garage_Wall_Front_R" group="Garage_Exterior" mat="paintGarage" {...span(-9.8, -9, 0, 3.7, 4.7, 5)} />
        <Part name="Garage_Wall_Header" group="Garage_Exterior" mat="paintGarage" {...span(-15.8, -9.8, 3.0, 3.7, 4.7, 5)} />
      </group>
    </group>
  );
}

function GlassSystem() {
  return (
    <group name="GLASS_SYSTEM">
      <group name="Windows">
        <GlassRun name="GF_Rear_Window" group="Windows" axis="x" from={-6} to={6} fixed={-5.85} y0={1.2} y1={3.2} bays={4} />
        <GlassRun name="UF_Ribbon" group="Windows" axis="x" from={0.4} to={11.6} fixed={7.33} y0={UF.y0} y1={UF.y1} bays={5} />
        <GlassRun name="UF_Rear_Window" group="Windows" axis="x" from={-3} to={9} fixed={-4.85} y0={5.2} y1={7.0} bays={4} />
      </group>
      <group name="Glass_Doors">
        <GlassRun name="GF_Front_Glazing" group="Glass_Doors" axis="x" from={-4.45} to={9} fixed={5.85} y0={GF.y0} y1={GF.y1} bays={6} />
        <GlassRun name="GF_Side_Sliders" group="Glass_Doors" axis="z" from={-3} to={5.85} fixed={8.85} y0={GF.y0} y1={GF.y1} bays={3} />
        <GlassRun name="UF_Loggia_Glazing" group="Glass_Doors" axis="x" from={-5.6} to={-0.8} fixed={5.58} y0={UF.y0} y1={UF.y1} bays={2} />
      </group>
    </group>
  );
}

function WoodSystem() {
  return (
    <group name="WOOD_SYSTEM">
      <group name="Main_Door">
        <Part name="Main_Door_Leaf" group="Main_Door" mat="woodDoor" {...span(-7.7, -6.3, GF.y0, 3.5, 5.74, 5.86)} />
      </group>
      <group name="Wood_Details">
        <Part name="Soffit_Front" group="Wood_Details" mat="woodSoffit" {...span(-6, 9, 3.86, 3.88, 6.0, 7.8)} castShadow={false} />
        <Part name="Soffit_Side" group="Wood_Details" mat="woodSoffit" {...span(9, 12.3, 3.86, 3.88, -5, 6.0)} castShadow={false} />
        <Part name="Loggia_Deck" group="Wood_Details" mat="woodSoffit" {...span(-5.6, -0.8, UF.y0, UF.y0 + 0.05, 5.6, 7.5)} />
        <Part name="Loggia_Ceiling" group="Wood_Details" mat="woodSoffit" {...span(-5.6, -0.8, UF.y1 - 0.04, UF.y1, 5.6, 7.5)} castShadow={false} />
        {steps(-4.2, 6.6, 30).map((z, i) => (
          <Part key={i} name={`Louvre_${i}`} group="Wood_Details" mat="woodLouvre" {...span(12.02, 12.14, 4.55, 7.45, z - 0.05, z + 0.05)} />
        ))}
      </group>
    </group>
  );
}

function MetalSystem() {
  return (
    <group name="METAL_SYSTEM">
      <group name="Railings">
        <Part name="Loggia_Balustrade_Glass" group="Railings" mat="glass" {...span(-5.6, -0.8, UF.y0, UF.y0 + 1.1, 7.38, 7.42)} castShadow={false} />
        <Part name="Loggia_Handrail" group="Railings" mat="railing" {...span(-5.6, -0.8, UF.y0 + 1.08, UF.y0 + 1.13, 7.35, 7.45)} />
        <Part name="Loggia_Base_Channel" group="Railings" mat="railing" {...span(-5.6, -0.8, UF.y0, UF.y0 + 0.08, 7.35, 7.45)} />
      </group>
      <group name="Exterior_Fittings">
        <Part name="Garage_Door" group="Exterior_Fittings" mat="garageDoor" {...span(-15.8, -9.8, 0, 3.0, 4.78, 4.86)} />
        <Part name="Door_Pull" group="Exterior_Fittings" mat="fittings" {...span(-6.55, -6.5, 1.0, 2.6, 5.86, 5.94)} />
        <Part name="Roof_Membrane" group="Exterior_Fittings" mat="concrete" {...span(-5.9, 11.9, 8.0, 8.02, -4.9, 7.4)} castShadow={false} />
      </group>
    </group>
  );
}

function StoneSystem() {
  return (
    <group name="STONE_SYSTEM">
      <Part name="Entrance_Blade_Wall" group="Stone_Features" mat="stone" {...span(-4.9, -4.45, 0, 3.86, 5.7, 10.4)} />
      <Part name="Garden_Wall" group="Stone_Features" mat="stone" {...span(-16.6, -10.2, 0, 1.1, -12, -11.6)} />
      <Part name="House_Plinth" group="Plinth" mat="concrete" {...span(-9.2, 9.2, 0, 0.3, -6.2, 6)} />
      <Part name="Entrance_Step_1" group="Plinth" mat="concrete" {...span(-8.3, -5.7, 0, 0.15, 6, 7.4)} />
      <Part name="Entrance_Step_2" group="Plinth" mat="concrete" {...span(-8.3, -5.7, 0.15, 0.3, 6, 6.7)} />
    </group>
  );
}

function Interior() {
  return (
    <group name="INTERIOR">
      <Part name="GF_Interior_Shell" group="Interior" mat="interiorWall" {...span(-8.7, 8.7, GF.y0, GF.y1, -5.7, 5.7)} castShadow={false} />
      <Part name="GF_Interior_Floor" group="Interior" mat="interiorFloor" {...span(-8.7, 8.7, GF.y0, GF.y0 + 0.02, -5.7, 5.7)} castShadow={false} />
      <Part name="UF_Interior_Shell_A" group="Interior" mat="interiorWall" {...span(-5.7, -0.5, UF.y0, UF.y1, -4.7, 5.55)} castShadow={false} />
      <Part name="UF_Interior_Shell_B" group="Interior" mat="interiorWall" {...span(-0.5, 11.7, UF.y0, UF.y1, -4.7, 7.2)} castShadow={false} />
      <Part name="UF_Interior_Floor" group="Interior" mat="interiorFloor" {...span(-5.7, 11.7, UF.y0, UF.y0 + 0.02, -4.7, 7.2)} castShadow={false} />

      {/* Furniture silhouettes read through the glazing */}
      <Part name="Sofa_Base" group="Interior" mat="interiorFurniture" {...span(-1.5, 2.5, 0.32, 0.75, 1.2, 2.2)} />
      <Part name="Sofa_Back" group="Interior" mat="interiorFurniture" {...span(-1.5, 2.5, 0.32, 1.1, 1.0, 1.3)} />
      <Part name="Sofa_Return" group="Interior" mat="interiorFurniture" {...span(-1.5, -0.5, 0.32, 0.75, 2.2, 3.6)} />
      <Part name="Dining_Table" group="Interior" mat="interiorFurniture" {...span(4.6, 7.6, 1.0, 1.06, 1.4, 2.6)} />
      <Part name="Dining_Plinth" group="Interior" mat="interiorFurniture" {...span(5.6, 6.6, 0.32, 1.0, 1.8, 2.2)} />
      <Part name="UF_Bed" group="Interior" mat="interiorFurniture" {...span(5, 7.2, UF.y0, UF.y0 + 0.55, 2, 4.4)} />
      <Part name="UF_Desk" group="Interior" mat="interiorFurniture" {...span(1, 3, UF.y0 + 0.72, UF.y0 + 0.78, 5.6, 6.4)} />

      <Part name="GF_Ceiling_Light" group="Exterior_Lighting" mat="lightWarm" {...span(-6, 7, GF.y1 - 0.02, GF.y1, 2.6, 2.8)} castShadow={false} />
      <Part name="UF_Ceiling_Light" group="Exterior_Lighting" mat="lightWarm" {...span(1, 11, UF.y1 - 0.02, UF.y1, 4.8, 5.0)} castShadow={false} />
    </group>
  );
}

function RecessedLighting() {
  const front = steps(-5, 8, 6).map((x) => [x, 6.9] as const);
  const side = steps(-3.5, 4.5, 3).map((z) => [10.6, z] as const);
  return (
    <group name="Recessed_Lighting">
      {[...front, ...side].map(([x, z], i) => (
        <Part key={i} name={`Downlight_${i}`} group="Exterior_Lighting" mat="lightWarm" {...span(x - 0.12, x + 0.12, 3.845, 3.86, z - 0.12, z + 0.12)} castShadow={false} />
      ))}
      <Part name="Blade_Wall_Uplight" group="Exterior_Lighting" mat="lightWarm" {...span(-4.4, -4.3, 0.3, 0.34, 6, 10.2)} castShadow={false} />
      <Part name="Loggia_Strip" group="Exterior_Lighting" mat="lightWarm" {...span(-5.5, -0.9, UF.y1 - 0.06, UF.y1 - 0.04, 7.3, 7.4)} castShadow={false} />
    </group>
  );
}

export function MansionModel() {
  return (
    <group name="ESTATEVERSE_MANSION">
      <BuildingStructure />
      <GlassSystem />
      <WoodSystem />
      <MetalSystem />
      <StoneSystem />
      <Interior />
      <RecessedLighting />
    </group>
  );
}
