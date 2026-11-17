import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "My Designs" };

export default function DesignsPage() {
  return (
    <>
      <PageHeader eyebrow="My designs" title="Every facade you have imagined.">
        Saved designs keep their colour, lighting and camera angle, stored privately in this browser.
      </PageHeader>
      <PhaseNotice
        phase="Phase 7"
        title="Saving and export are being built."
        image={media.terracePool}
        items={[
          "Name and save a design in this browser — no account needed",
          "Reopen a design with its exact colour, lighting and view",
          "Download a high-resolution image of the residence",
          "Export design data to share or keep",
        ]}
      />
    </>
  );
}
