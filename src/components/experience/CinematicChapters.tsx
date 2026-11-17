"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, Rotate3d } from "lucide-react";
import { CHAPTERS } from "@/lib/three/cameraChoreography";
import type { CameraRig } from "@/lib/three/cameraRig";
import { buttonClasses } from "@/components/ui/ButtonLink";

gsap.registerPlugin(ScrollTrigger);

/**
 * The scroll track for the cinematic journey. ScrollTrigger maps scroll position
 * to rig progress; the 3D camera eases towards it. Chapter lines scroll naturally
 * over the fixed canvas.
 */
/**
 * Fade each chapter line by where it sits on screen: in from the bottom, out
 * before it reaches the navigation. The final chapter never fades out.
 */
function applyFades(lines: (HTMLElement | null)[]) {
  const h = window.innerHeight;
  lines.forEach((line, i) => {
    if (!line) return;
    const top = line.getBoundingClientRect().top;
    const fadeIn = Math.min(1, Math.max(0, (h * 0.95 - top) / (h * 0.3)));
    const final = i === lines.length - 1;
    const fadeOut = final ? 1 : Math.min(1, Math.max(0, (top - h * 0.1) / (h * 0.18)));
    line.style.opacity = String(Math.min(fadeIn, fadeOut));
  });
}

export function CinematicChapters({ rig, onExplore }: { rig: CameraRig; onExplore: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const element = track.current;
    if (!element) return;
    // Resume where the visitor left the film.
    const max = element.offsetHeight - window.innerHeight;
    window.scrollTo({ top: rig.progress * max, behavior: "instant" });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        rig.setProgress(self.progress);
        applyFades(lines.current);
      },
      onRefresh: () => applyFades(lines.current),
    });
    applyFades(lines.current);
    return () => trigger.kill();
  }, [rig]);

  return (
    <div ref={track} className="relative z-10" aria-label="Cinematic tour">
      {CHAPTERS.map((chapter, i) => {
        const last = i === CHAPTERS.length - 1;
        return (
          <section key={chapter.index} className="flex h-[120svh] items-end first:h-[100svh] last:h-[100svh]">
            <div
              ref={(node) => {
                lines.current[i] = node;
              }}
              className="mx-auto w-full max-w-[1440px] px-5 pb-48 md:px-10 md:pb-40"
            >
              <p className="eyebrow mb-4 text-stone">{chapter.index}</p>
              <h2 className="max-w-2xl font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[1.02] tracking-tight [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">
                {chapter.title}
              </h2>
              {i === 0 ? (
                <p className="mt-8 flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.24em] text-stone">
                  <ArrowDown aria-hidden className="size-4 animate-cue" strokeWidth={1.5} />
                  Scroll
                </p>
              ) : null}
              {i === 3 ? (
                <div className="mt-8">
                  <Link href="/studio" className={buttonClasses("primary")}>
                    Capture a colour
                    <ArrowRight aria-hidden className="size-4" strokeWidth={1.5} />
                  </Link>
                </div>
              ) : null}
              {last ? (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={onExplore} className={buttonClasses("primary")}>
                    Explore freely
                    <Rotate3d aria-hidden className="size-4" strokeWidth={1.5} />
                  </button>
                  <Link href="/studio" className={buttonClasses("secondary")}>
                    Colour Studio
                  </Link>
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
