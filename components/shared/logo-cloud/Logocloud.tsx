"use client";

import { CurvyRect } from "@/components/shared/ui";
import Image from "@/components/shared/image/Image";
import { useEffect, useState } from "react";
import "./Logocloud.css";
import MarqueeAnimation from "@/components/ui/motion/marquee-animation";

export default function Logocloud() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 996); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Create array starting from index 1, with 17-19 first on desktop, then 1-21
  const logoIndices = isMobile
    ? Array.from({ length: 21 }, (_, i) => i + 1)
    : [17, 18, ...Array.from({ length: 21 }, (_, i) => i + 1)];

  return (
    <div className="container relative -mt-1 lg:flex" data-allow-motion="true">
      <div className="h-1 bottom-0 absolute left-0 w-full bg-border-faint" />
      <div className="p-16 lg-max:text-center lg:p-40 relative">
        <CurvyRect className="overlay" allSides />

        <div className="text-body-large text-accent-black">
          Trusted by{" "}
          <span className="contents text-label-large text-heat-100">
            5000+ <br /> companies
          </span>{" "}
          of all sizes
        </div>
      </div>

      <div className="flex-1 lg-max:h-96 min-w-0 relative lg:-ml-1 lg-max:-mt-1">
        <div className="h-full left-0 top-0 w-1 bg-border-faint absolute lg-max:w-full lg-max:h-1" />

        <CurvyRect className="overlay" allSides />

        <div className="w-full h-full overflow-hidden">
          <MarqueeAnimation
            className="w-max h-full flex transform-gpu will-change-transform"
            duration={isMobile ? 80000 : 100000}
          >
            <div className="flex h-full">
              {logoIndices.map((logoIndex, i) => (
                <div
                  className="h-full aspect-[204/96] lg:aspect-[204/128] -ml-1 relative w-max"
                  key={i}
                >
                  <Image
                    alt={`Logo ${logoIndex}`}
                    className="absolute object-cover w-full h-full"
                    src={`logocloud/${logoIndex}`}
                    raw
                    loading="eager"
                    decoding="async"
                  />

                  <div className="overlay border-x border-border-faint" />
                </div>
              ))}
            </div>
          </MarqueeAnimation>
        </div>
      </div>
    </div>
  );
}
