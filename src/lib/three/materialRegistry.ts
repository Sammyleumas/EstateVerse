import { Color, type Material, type Mesh, MeshStandardMaterial, type Object3D } from "three";
import type { ExteriorMaterialEntry, PartGroup, PartTag, RegistrySummary } from "@/types/scene";

type StandardLike = MeshStandardMaterial;

const HIGHLIGHT = new Color("#cdb48c");

function isTagged(object: Object3D): object is Mesh & { userData: { estateverse: PartTag } } {
  return (object as Mesh).isMesh === true && typeof object.userData?.estateverse === "object";
}

function materialsOf(mesh: Mesh): Material[] {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

/**
 * Central registry of the mansion's materials.
 *
 * Every mesh is tagged with metadata (`userData.estateverse`) when it is created,
 * so eligibility never depends on object names. The registry enforces that a
 * material instance is never shared between a paintable and a protected mesh,
 * which is what keeps glass, timber, metal and landscape safe from exterior paint.
 */
export class MaterialRegistry {
  private entries: ExteriorMaterialEntry[] = [];
  private paintable = new Map<string, StandardLike>();
  private original = new Map<string, { color: Color; emissive: Color; emissiveIntensity: number }>();
  private highlighted = false;

  scan(root: Object3D) {
    this.entries = [];
    this.paintable.clear();
    const owner = new Map<string, boolean>();
    const untagged: string[] = [];

    root.traverse((object) => {
      if (!(object as Mesh).isMesh) return;
      if (!isTagged(object)) {
        untagged.push(object.name || object.type);
        return;
      }
      const tag = object.userData.estateverse;
      for (const material of materialsOf(object)) {
        const previous = owner.get(material.uuid);
        if (previous !== undefined && previous !== tag.paintable) {
          throw new Error(
            `Material "${material.name}" is shared between paintable and protected meshes (${object.name}).`,
          );
        }
        owner.set(material.uuid, tag.paintable);

        const standard = material as StandardLike;
        this.entries.push({
          meshId: object.uuid,
          meshName: object.name,
          materialId: material.uuid,
          group: tag.group,
          category: tag.category,
          originalColor: standard.color ? `#${standard.color.getHexString()}` : "n/a",
          paintable: tag.paintable,
        });

        if (tag.paintable) {
          if (!(standard instanceof MeshStandardMaterial)) {
            throw new Error(`Paintable material "${material.name}" must be a MeshStandardMaterial.`);
          }
          this.paintable.set(material.uuid, standard);
          if (!this.original.has(material.uuid)) {
            this.original.set(material.uuid, {
              color: standard.color.clone(),
              emissive: standard.emissive.clone(),
              emissiveIntensity: standard.emissiveIntensity,
            });
          }
        }
      }
    });

    if (untagged.length && process.env.NODE_ENV !== "production") {
      console.warn(`[MaterialRegistry] ${untagged.length} untagged meshes`, untagged.slice(0, 10));
    }
  }

  getEntries(): readonly ExteriorMaterialEntry[] {
    return this.entries;
  }

  getPaintableMaterials(): StandardLike[] {
    return [...this.paintable.values()];
  }

  summary(): RegistrySummary {
    const groups = new Map<PartGroup, { meshes: Set<string>; paintable: boolean }>();
    for (const entry of this.entries) {
      const group = groups.get(entry.group) ?? { meshes: new Set<string>(), paintable: entry.paintable };
      group.meshes.add(entry.meshId);
      groups.set(entry.group, group);
    }
    const paintableMeshes = new Set(this.entries.filter((e) => e.paintable).map((e) => e.meshId)).size;
    const protectedMeshes = new Set(this.entries.filter((e) => !e.paintable).map((e) => e.meshId)).size;
    return {
      paintableMeshes,
      protectedMeshes,
      paintableMaterials: this.paintable.size,
      groups: [...groups.entries()]
        .map(([group, value]) => ({ group, meshes: value.meshes.size, paintable: value.paintable }))
        .sort((a, b) => Number(b.paintable) - Number(a.paintable) || b.meshes - a.meshes),
    };
  }

  /** Visual check of eligibility: paints only eligible surfaces in the accent colour, then restores them exactly. */
  setHighlight(on: boolean) {
    this.highlighted = on;
    for (const [id, material] of this.paintable) {
      const original = this.original.get(id);
      if (!original) continue;
      if (on) {
        material.color.copy(HIGHLIGHT);
        material.emissive.copy(HIGHLIGHT);
        material.emissiveIntensity = 0.18;
      } else {
        material.color.copy(original.color);
        material.emissive.copy(original.emissive);
        material.emissiveIntensity = original.emissiveIntensity;
      }
    }
  }

  isHighlighted() {
    return this.highlighted;
  }
}
