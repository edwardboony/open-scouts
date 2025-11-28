"use client";

import { useState } from "react";

import CurvyRect from "@/components/shared/layout/curvy-rect";

import DeveloperFeaturesCode from "./Code/Code";
import DeveloperFeaturesTabs from "./Tabs/Tabs";
import DeveloperFeaturesToolbar from "./Toolbar/Toolbar";

export default function DeveloperFeatures() {
  const [activeTab, setActiveTab] = useState<string>("scrape");
  const [language, setLanguage] = useState<string>("python");

  return (
    <div className="-mt-1">
      <DeveloperFeaturesTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="grid grid-cols-2 relative -mt-33 lg:-mt-1">
        <div className="bottom-0 left-0 absolute h-1 w-full bg-border-faint" />

        <CurvyRect className="overlay" allSides />

        <div className="flex gap-10 p-15 items-center relative">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="w-12 h-12 rounded-full relative before:inside-border before:border-border-muted"
              key={index}
            />
          ))}

          <div className="h-full right-0 top-0 w-1 bg-border-faint absolute lg-max:hidden" />
        </div>

        <div className="flex p-15 gap-12 lg-max:hidden">
          <div className="flex-1 h-12 relative rounded-full before:inside-border before:border-border-faint" />
          <div className="size-12 relative rounded-full before:inside-border before:border-border-faint" />
          <div className="flex-1 h-12 relative rounded-full before:inside-border before:border-border-faint" />
        </div>
      </div>

      <DeveloperFeaturesToolbar
        feature={activeTab}
        language={language}
        setLanguage={setLanguage}
      />

      <DeveloperFeaturesCode feature={activeTab} language={language} />

      <div className="h-60 lg-max:hidden -mt-1 relative border-y border-border-faint">
        <CurvyRect className="absolute inset-x-0 -inset-y-1" allSides />
      </div>
    </div>
  );
}
