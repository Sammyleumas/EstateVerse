import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "My Designs" };

export default function DesignsPage() {
  return (
    <>
      <PageHeader eyebrow="My designs" title="Every facade you have imagined." />
      <PhaseNotice phase="Phase 7" image={media.terracePool} />
    </>
  );
}
