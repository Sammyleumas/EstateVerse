import type { Metadata } from "next";
import { ExperienceShell } from "@/components/experience/ExperienceShell";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return <ExperienceShell />;
}
