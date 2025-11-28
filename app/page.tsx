"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ScoutInput } from "@/components/scout-input";
import HomeHeroBackground from "@/components/app/(home)/sections/hero/Background/Background";
import { BackgroundOuterPiece } from "@/components/app/(home)/sections/hero/Background/BackgroundOuterPiece";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";
import HomeHeroPixi from "@/components/app/(home)/sections/hero/Pixi/Pixi";
import HowItWorks from "@/components/app/(home)/sections/scout/HowItWorks";
import AlwaysSearching from "@/components/app/(home)/sections/scout/AlwaysSearching";
import RecentDiscoveries from "@/components/app/(home)/sections/scout/RecentDiscoveries";

const placeholders = [
  "Scout for Taylor Swift tickets in my city...",
  "Tell me when Mr. Beast comes to my city...",
  "Scout for new Chinese restaurants near me...",
  "Scout for Tesla Cybertruck available for test drive...",
  "Scout for cheap flights to Tokyo next month...",
  "Scout for PS5 restocks at local stores...",
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user's location
      let location: {
        city: string;
        latitude: number;
        longitude: number;
      } | null = null;
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            },
          );

          const { latitude, longitude } = position.coords;

          // Reverse geocode to get city name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Unknown";

          location = {
            city,
            latitude,
            longitude,
          };
        } catch (error) {
          console.error("Error getting location:", error);
        }
      }

      // Create new scout
      const { data: scoutData, error } = await supabase
        .from("scouts")
        .insert({
          title: query.slice(0, 50) + (query.length > 50 ? "..." : ""),
          location: location,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating scout:", error);
        setIsSubmitting(false);
        return;
      }

      if (scoutData) {
        // Redirect to scout page with query as URL parameter
        router.push(
          `/scout/${scoutData.id}?initialQuery=${encodeURIComponent(query)}`,
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        className="overflow-x-clip min-h-screen flex flex-col"
        id="home-hero"
      >
        <div
          className="relative flex-1 flex flex-col items-center justify-center"
          id="hero-content"
        >
          <HomeHeroPixi />
          <HeroFlame />
          <BackgroundOuterPiece />
          <HomeHeroBackground />

          <div className="relative container px-16 w-full -mt-100 2xl:-mt-[250px]">
            <div className="max-w-5xl w-full mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-4xl md:text-7xl text-[#262626] mb-4">
                  Open <span className="text-heat-100">Scouts</span>
                </h1>
                <p className="text-lg md:text-lg text-gray-600">
                  Create AI scouts that continuously search and notify you when
                  <br></br>
                  they find what you&apos;re looking for
                </p>
              </div>

              <div className="mb-8 py-10">
                <ScoutInput
                  placeholders={placeholders}
                  onChange={(e) => setQuery(e.target.value)}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Discoveries Section */}
      <RecentDiscoveries />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Always Searching Section */}
      <AlwaysSearching />
    </>
  );
}
