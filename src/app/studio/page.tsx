import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "Colour Studio" };

export default function StudioPage() {
  return (
    <>
      <PageHeader eyebrow="Colour Studio" title="Capture a colour from the world around you." />
      <PhaseNotice phase="Phase 4" image={media.frontElevation} />
    </>
  );
}
