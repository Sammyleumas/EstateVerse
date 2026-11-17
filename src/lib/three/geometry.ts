import { BoxGeometry, BufferGeometry, CylinderGeometry, SphereGeometry, Vector3 } from "three";

const cache = new Map<string, BufferGeometry>();

function cached<T extends BufferGeometry>(key: string, build: () => T): T {
  let geometry = cache.get(key) as T | undefined;
  if (!geometry) {
    geometry = build();
    cache.set(key, geometry);
  }
  return geometry;
}

/**
 * Box whose UVs are measured in metres / tile, so a texture keeps the same
 * real-world scale on a 0.3 m column and a 20 m wall.
 */
export function worldBox(w: number, h: number, d: number, tile: number) {
  const key = `box:${w.toFixed(3)}:${h.toFixed(3)}:${d.toFixed(3)}:${tile}`;
  return cached(key, () => {
    const geometry = new BoxGeometry(w, h, d);
    const uv = geometry.getAttribute("uv");
    // Face order: +x, -x, +y, -y, +z, -z (4 vertices each).
    const faceSize: [number, number][] = [
      [d, h],
      [d, h],
      [w, d],
      [w, d],
      [w, h],
      [w, h],
    ];
    for (let face = 0; face < 6; face++) {
      const [su, sv] = faceSize[face];
      for (let v = 0; v < 4; v++) {
        const index = face * 4 + v;
        uv.setXY(index, (uv.getX(index) * su) / tile, (uv.getY(index) * sv) / tile);
      }
    }
    uv.needsUpdate = true;
    return geometry;
  });
}

export function worldCylinder(radius: number, height: number, tile: number, segments = 16) {
  return cached(`cyl:${radius}:${height}:${tile}:${segments}`, () => {
    const geometry = new CylinderGeometry(radius * 0.8, radius, height, segments);
    const uv = geometry.getAttribute("uv");
    const circumference = Math.PI * 2 * radius;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (uv.getX(i) * circumference) / tile, (uv.getY(i) * height) / tile);
    }
    return geometry;
  });
}

/** Deterministic pseudo-noise so foliage looks organic but never changes between renders. */
function noise(p: Vector3, seed: number) {
  return (
    Math.sin(p.x * 2.1 + seed) * Math.cos(p.y * 1.7 + seed * 1.3) * 0.5 +
    Math.sin(p.z * 2.7 + seed * 0.7) * Math.cos(p.x * 1.9 - seed) * 0.35 +
    Math.sin((p.x + p.y + p.z) * 4.3 + seed * 2.1) * 0.15
  );
}

/** Irregular foliage mass: a sphere displaced along its normals. */
export function foliage(seed: number, roughness = 0.22) {
  return cached(`foliage:${seed}:${roughness}`, () => {
    const geometry = new SphereGeometry(1, 40, 28);
    const position = geometry.getAttribute("position");
    const v = new Vector3();
    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i);
      const scale = 1 + noise(v, seed) * roughness;
      v.multiplyScalar(scale);
      position.setXYZ(i, v.x, v.y, v.z);
    }
    const uv = geometry.getAttribute("uv");
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 4, uv.getY(i) * 2);
    geometry.computeVertexNormals();
    return geometry;
  });
}

export function disposeGeometryCache() {
  cache.forEach((geometry) => geometry.dispose());
  cache.clear();
}
