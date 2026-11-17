import { Hero } from "@/components/landing/Hero";
import { Process } from "@/components/landing/Process";
import { Residence } from "@/components/landing/Residence";
import { Modes } from "@/components/landing/Modes";
import { Privacy } from "@/components/landing/Privacy";
import { ClosingCta } from "@/components/landing/ClosingCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Process />
      <Residence />
      <Modes />
      <Privacy />
      <ClosingCta />
    </>
  );
}
