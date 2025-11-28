import Code from "@/components/ui/code";
import CurvyRect from "@/components/shared/layout/curvy-rect";
import {
  codes,
  outputs,
} from "@/components/app/(home)/sections/developer/Features/codes";

import useSwitchingCode from "@/hooks/useSwitchingCode";

export default function DeveloperFeaturesCode({
  feature,
  language,
}: {
  feature: string;
  language: string;
}) {
  return (
    <div className="lg:pt-12 lg:pl-28 -mt-1 w-full lg:pb-32 relative">
      <CurvyRect className="overlay lg-max:hidden" allSides />

      <div className="relative lg:contents">
        <CurvyRect className="overlay lg:hidden" allSides />

        <div className="[&_.linenumber]:!w-68 lg-max:pl-4 lg-max:pb-20 lg-max:pr-20 lg-max:overflow-x-scroll lg-max:[&_.prismjs]:w-max">
          <LeftSideCode feature={feature} language={language} />
        </div>
      </div>

      <div className="lg:w-472 lg:absolute lg-max:-mt-1 lg-max:border-t border-border-faint z-[2] top-0 right-0 lg:h-343 flex bg-background-base">
        <div className="h-1 top-0 absolute left-0 w-full bg-border-faint" />
        <div className="h-1 bottom-0 absolute left-0 w-full bg-border-faint" />
        <div className="h-full top-0 absolute left-0 w-1 bg-border-faint" />

        <div className="flex-1 relative min-w-0 lg-max:-mt-1">
          <CurvyRect
            className="absolute w-full lg:w-[calc(100%+1px)] h-full left-0 top-0"
            allSides
          />
          <CurvyRect
            className="absolute w-20 h-full right-[calc(100%-1px)] top-0 lg-max:hidden"
            right
          />

          <div className="pl-15 border-b border-border-faint p-13 flex justify-between items-center">
            <div className="flex gap-10 items-center">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="w-12 h-12 rounded-full relative before:inside-border before:border-border-muted"
                  key={index}
                />
              ))}
            </div>

            <div className="!text-mono-x-small font-mono text-black-alpha-20">
              [ .<Extension feature={feature} /> ]
            </div>
          </div>

          <div className="[&_.linenumber]:!w-68 overflow-x-scroll lg-max:[&_.prismjs]:w-max lg-max:pb-20 lg-max:pr-20">
            <RightSideCode feature={feature} />
          </div>

          <div className="h-50 border-t border-border-faint lg:hidden" />
        </div>

        <div className="h-full w-48 lg-max:hidden border-x border-border-faint relative">
          <CurvyRect className="absolute -inset-x-1 inset-y-0" allSides />
        </div>
      </div>
    </div>
  );
}

const LeftSideCode = ({
  feature,
  language,
}: {
  feature: string;
  language: string;
}) => {
  const code = useSwitchingCode(
    codes[feature as keyof typeof codes][
      language as keyof (typeof codes)[keyof typeof codes]
    ],
  );

  return <Code code={code} language={language} />;
};

const RightSideCode = ({ feature }: { feature: string }) => {
  const code = useSwitchingCode(outputs[feature as keyof typeof outputs]);

  return (
    <Code code={code} language={feature === "search" ? "json" : "markdown"} />
  );
};

const Extension = ({ feature }: { feature: string }) => {
  return useSwitchingCode(feature === "search" ? "JSON" : "MD");
};
