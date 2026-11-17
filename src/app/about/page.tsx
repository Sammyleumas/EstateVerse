import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CameraOff, Cpu, HardDrive, Lock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { media } from "@/lib/media";

export const metadata: Metadata = { title: "About" };

const CAMERA_FACTS = [
  { icon: ShieldCheck, title: "Only when you ask", body: "Your browser asks for permission only after you choose to capture a colour. The camera never starts on its own." },
  { icon: Cpu, title: "Processed on your device", body: "The colour is read from the live frame inside your browser. No image or video is sent to any server." },
  { icon: HardDrive, title: "Nothing recorded", body: "No video and no photos are stored. Only the colour value you choose to keep is saved, in this browser." },
  { icon: CameraOff, title: "Switched off on close", body: "Every camera stream is stopped as soon as you close the capture view or leave the page." },
  { icon: Lock, title: "Secure connections only", body: "Browsers allow camera access only over HTTPS, so ESTATEVERSE is served over HTTPS." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Architecture that answers to the world around you.">
        ESTATEVERSE is an interactive architectural experience. It brings together a 3D residence, the camera
        in your pocket and real-time materials, so a colour you find in the world can become a facade.
      </PageHeader>

      <section className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 pb-24 md:px-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={media.modernExterior.src} alt={media.modernExterior.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-6 leading-relaxed text-stone">
          <h2 className="font-display text-3xl font-light tracking-tight text-bone">A note on colour accuracy</h2>
          <p>
            A camera does not see colour exactly as your eyes do. Lighting, exposure, white balance, shadows and
            reflections all change the reading.
          </p>
          <p>
            ESTATEVERSE averages a small area around the point you tap to reduce noise, then lets you preview and
            adjust the result. Treat the colour as a strong starting point, not a paint-match.
          </p>
          <div>
            <ButtonLink href="/experience" variant="ghost" icon={<ArrowRight className="size-4" strokeWidth={1.5} />}>
              Enter experience
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="camera-privacy" aria-labelledby="camera-privacy-title" className="scroll-mt-24 border-t border-line bg-charcoal">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <p className="eyebrow mb-6">Camera privacy</p>
          <h2 id="camera-privacy-title" className="max-w-3xl font-display text-4xl font-light tracking-tight md:text-5xl">
            How ESTATEVERSE uses your camera.
          </h2>
          <ul className="mt-14 grid border-t border-line md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {CAMERA_FACTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="border-b border-line py-8 md:py-10">
                <Icon aria-hidden className="mb-6 size-6 text-champagne" strokeWidth={1.25} />
                <h3 className="mb-3 text-lg text-bone">{title}</h3>
                <p className="leading-relaxed text-stone">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
