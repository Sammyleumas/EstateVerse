import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader eyebrow="Settings" title="Display and privacy.">
        Preferences are saved in this browser. No account is needed.
      </PageHeader>
      <SettingsPanel />
    </>
  );
}
