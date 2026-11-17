import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <>
      <PageHeader eyebrow="The experience" title="The residence, in three dimensions.">
        A full-screen 3D model of the signature home, explored as a cinematic journey or freely in 360°.
      </PageHeader>
      <PhaseNotice
        phase="Phases 2–3"
        title="The 3D scene is being built."
        image={media.heroDusk}
        items={[
          "Two-storey contemporary residence with terrace, pool, garden and driveway",
          "Cinematic scroll journey through five architectural scenes",
          "Free 360° orbit with front, side, rear and elevated views",
          "Daylight, sunset and night lighting",
        ]}
      />
    </>
  );
}
