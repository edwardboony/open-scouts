"use client";

import { useEffect, useState } from "react";

import useSwitchingCode from "@/hooks/useSwitchingCode";

export default function DeveloperTitleHighlight() {
  const [text, setText] = useState("scraping");

  const title = useSwitchingCode(text);

  useEffect(() => {
    const developerFeaturesTabs = document.querySelector(
      ".developer-features-tabs",
    );

    if (developerFeaturesTabs) {
      developerFeaturesTabs.addEventListener("tab-change", (e) => {
        setText((e as CustomEvent).detail);
      });
    }
  }, []);

  return <>{title}</>;
}
