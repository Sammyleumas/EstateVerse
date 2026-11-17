import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <PageHeader eyebrow="404" title="This room does not exist.">
      <div className="mt-2">
        <ButtonLink href="/" variant="secondary" icon={<ArrowLeft className="size-4" strokeWidth={1.5} />}>
          Back to the residence
        </ButtonLink>
      </div>
    </PageHeader>
  );
}
