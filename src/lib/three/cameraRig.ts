import { Vector3 } from "three";
import { VIEW_PRESETS } from "./cameraChoreography";

/**
 * Shared camera state between the DOM (scroll) and the 3D scene.
 * Exactly one controller (cinematic or free) writes to it at a time.
 */
export class CameraRig {
  /** Where the camera is currently looking. */
  readonly target = new Vector3(...VIEW_PRESETS.home.target);
  /** Scroll progress through the cinematic journey, 0 → 1. */
  progress = 0;
  /** True until the first controller has placed the camera. */
  firstPlacement = true;
  private wake: (() => void) | null = null;

  setProgress(value: number) {
    this.progress = Math.min(1, Math.max(0, value));
    this.wake?.();
  }

  setTarget(value: Vector3) {
    this.target.copy(value);
  }

  lerpTarget(from: Vector3, to: Vector3, t: number) {
    this.target.lerpVectors(from, to, t);
  }

  markPlaced() {
    this.firstPlacement = false;
  }

  /** The scene registers its invalidate() so scroll can request frames in demand mode. */
  connect(wake: (() => void) | null) {
    this.wake = wake;
  }
}
