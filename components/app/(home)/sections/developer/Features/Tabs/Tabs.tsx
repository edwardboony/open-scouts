import { animate } from "motion";
import { useRef } from "react";

import CurvyRect from "@/components/shared/layout/curvy-rect";
import { cn } from "@/lib/utils";
import EndpointsScrape from "../../../endpoints/EndpointsScrape/EndpointsScrape";
import EndpointsCrawl from "../../../endpoints/EndpointsCrawl/EndpointsCrawl";
import EndpointsSearch from "../../../endpoints/EndpointsSearch/EndpointsSearch";

export const tabs = [
  {
    label: "Scrape",
    value: "scrape",
    action: "scraping",
    description:
      "Get llm-ready data from websites. Markdown, JSON, screenshot, etc.",
    icon: EndpointsScrape,
  },
  {
    label: "Search",
    value: "search",
    action: "searching",
    new: true,
    description: "Search the web and get full content from results.",
    icon: EndpointsSearch,
  },
  {
    label: "Crawl",
    value: "crawl",
    action: "crawling",
    description: "Crawl all the pages on a website and get data for each page.",
    icon: EndpointsCrawl,
  },
];

export default function DeveloperFeaturesTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const developerFeaturesTabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative lg:contents z-[1]">
      <CurvyRect
        className="lg:hidden top-31 h-77 absolute w-full left-0"
        allSides
      />

      <div className="overflow-x-scroll hide-scrollbar py-32 -my-32 lg:contents relative">
        <div
          className="flex lg:grid grid-cols-3 lg-max:w-max relative developer-features-tabs"
          ref={developerFeaturesTabsRef}
        >
          <div className="h-1 bottom-0 left-0 absolute bg-border-faint w-full" />

          <div
            className="absolute lg:top-12 lg:translate-x-12 top-8 translate-x-8 left-0 z-[2] inset-y-8 lg:inset-y-12 bg-white-alpha-72 rounded-12 lg:rounded-20 w-138 lg:w-[calc(100%/3-24px)] backdrop-blur-4"
            ref={backgroundRef}
            style={{
              boxShadow:
                "0px 40px 48px -20px rgba(0, 0, 0, 0.02), 0px 32px 32px -20px rgba(0, 0, 0, 0.03), 0px 16px 24px -12px rgba(0, 0, 0, 0.03), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)",
            }}
          />

          {tabs.map((tab, index) => (
            <div className="relative p-8 lg:p-12 group" key={index}>
              <CurvyRect
                className="[.group:nth-child(3)_&]:w-full w-[calc(100%+1px)] absolute h-full top-0 -left-1 [.group:nth-child(3)_&]:left-0 lg-max:hidden"
                allSides
              />

              <div className="h-full w-1 right-0 absolute bg-border-faint top-0" />

              <button
                className={cn(
                  "py-16 lg-max:pl-20 lg-max:pr-24 lg:py-32 text-center lg-max:flex lg-max:items-center gap-12 block w-full relative z-[3] before:inside-border before:border-border-faint before:opacity-0 rounded-12 lg:rounded-20 before:scale-[0.98] hover:before:scale-100",
                  activeTab !== tab.value && "lg:hover:before:opacity-100",
                )}
                onClick={(e) => {
                  setActiveTab(tab.value);

                  developerFeaturesTabsRef.current?.dispatchEvent(
                    new CustomEvent("tab-change", { detail: tab.action }),
                  );

                  const t = e.target as HTMLElement;

                  let target =
                    t instanceof HTMLButtonElement
                      ? t
                      : (t.closest("button") as HTMLButtonElement);
                  target = target.closest(".group") as HTMLButtonElement;

                  if (backgroundRef.current) {
                    animate(backgroundRef.current, { scale: 0.98 }).then(() =>
                      animate(backgroundRef.current!, { scale: 1 }),
                    );

                    animate(
                      backgroundRef.current,
                      {
                        x:
                          target.offsetLeft +
                          (window.innerWidth < 996 ? 8 : 12),
                        width:
                          target.offsetWidth -
                          (window.innerWidth < 996 ? 16 : 24),
                      },
                      {
                        type: "spring",
                        stiffness: 200,
                        damping: 23,
                      },
                    );
                  }

                  if (window.innerWidth < 996) {
                    const parent = backgroundRef.current!.parentElement!
                      .parentElement as HTMLDivElement;

                    parent.scrollTo({
                      left: target.offsetLeft - target.clientWidth / 2,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <div className="lg-max:contents flex justify-center">
                  <tab.icon active={activeTab === tab.value} size={28} />
                </div>

                <div className="text-label-medium justify-center text-accent-black lg:mt-20 lg:mb-8 flex gap-8 items-center">
                  {tab.label}

                  {tab.new && (
                    <div className="py-2 px-6 rounded-4 text-[12px]/[16px] font-[450] transition-all bg-heat-12 text-heat-100">
                      New
                    </div>
                  )}
                </div>

                <div className="text-black-alpha-72 lg-max:hidden text-body-medium max-w-230 mx-auto">
                  {tab.description}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
