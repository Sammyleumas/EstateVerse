import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "Colour Studio" };

export default function StudioPage() {
  return (
    <>
      <PageHeader eyebrow="Colour Studio" title="Capture a colour from the world around you.">
        Point your camera at anything, tap the exact spot, refine the reading and apply it to the
        whole facade.
      </PageHeader>
      <PhaseNotice
        phase="Phases 4–6"
        title="Camera capture and the studio are being built."
        image={media.frontElevation}
        items={[
          "Live camera preview with a tap-to-sample reticle, front and rear cameras",
          "Noise-resistant sampling with HEX and RGB readout",
          "Brightness and saturation refinement, preview before applying",
          "Undo, redo, colour history and an image-upload alternative",
        ]}
      />
    </>
  );
}
