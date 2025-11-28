"use client";

import CurvyRect from "@/components/shared/layout/curvy-rect";
import CurlIcon from "./_svg/CurlIcon";
import NodeIcon from "./_svg/NodeIcon";
import PythonIcon from "./_svg/PythonIcon";
import DeveloperFeaturesToolbarCopy from "./Copy/Copy";
import Tabs from "@/components/shared/tabs/Tabs";

const languages = [
  {
    label: "Python",
    value: "python",
    icon: <PythonIcon />,
  },
  {
    label: "Node.js",
    value: "javascript",
    icon: <NodeIcon />,
  },
  {
    label: "Curl",
    value: "curl",
    icon: <CurlIcon />,
  },
];

export default function DeveloperFeaturesToolbar({
  language,
  feature,
  setLanguage,
}: {
  language: string;
  feature: string;
  setLanguage: (language: string) => void;
}) {
  return (
    <div className="relative -mt-1 flex z-[1] justify-between">
      <div className="bottom-0 left-0 absolute h-1 w-full bg-border-faint" />

      <CurvyRect className="overlay" allSides />

      <Tabs activeTab={language} setActiveTab={setLanguage} tabs={languages} />

      <div className="py-12 px-18 border-l border-border-faint relative lg-max:hidden">
        <DeveloperFeaturesToolbarCopy feature={feature} language={language} />
      </div>
    </div>
  );
}
