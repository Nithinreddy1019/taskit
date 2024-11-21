import { Features } from "@/components/landing/features";
import { FeaturesAction } from "@/components/landing/features-action";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Navbar } from "@/components/landing/navbar";


export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <Hero />
      <Introduction />
      <Features />
      <FeaturesAction />
    </div>
  );
}
