import dynamic from "next/dynamic";

import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { Preloader } from "@/components/shared/Preloader";
import { CursorGlow } from "@/components/shared/CursorGlow";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { NoiseOverlay } from "@/components/shared/NoiseOverlay";
import { Navbar } from "@/components/shared/Navbar";
import { Marquee } from "@/components/shared/Marquee";
import { Hero } from "@/components/sections/Hero";
import { DroneShowcase } from "@/components/sections/DroneShowcase";

// Below-the-fold sections are split out to keep the initial bundle lean.
const Technology = dynamic(() =>
  import("@/components/sections/Technology").then((m) => m.Technology)
);
const VideoGallery = dynamic(() =>
  import("@/components/sections/VideoGallery").then((m) => m.VideoGallery)
);
const Numbers = dynamic(() =>
  import("@/components/sections/Numbers").then((m) => m.Numbers)
);
const Timeline = dynamic(() =>
  import("@/components/sections/Timeline").then((m) => m.Timeline)
);
const DroneFleet = dynamic(() =>
  import("@/components/sections/DroneFleet").then((m) => m.DroneFleet)
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact)
);
const Footer = dynamic(() =>
  import("@/components/shared/Footer").then((m) => m.Footer)
);

export default function Home() {
  return (
    <>
      <Preloader />
      <CursorGlow />
      <ScrollProgress />
      <NoiseOverlay />
      <Navbar />

      <SmoothScroll>
        <main className="relative">
          <Hero />
          <Marquee />
          <DroneShowcase />
          <Technology />
          <Numbers />
          <VideoGallery />
          <Timeline />
          <DroneFleet />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
