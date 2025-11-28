import copy from "copy-to-clipboard";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

import AnimatedWidth from "@/components/shared/layout/animated-width";
import { codes } from "@/components/app/(home)/sections/developer/Features/codes";
import { cn } from "@/lib/utils";

import CopiedIcon from "@/components/shared/icons/copied";
import CopyIcon from "@/components/shared/icons/copy";

export default function DeveloperFeaturesToolbarCopy({
  language,
  feature,
}: {
  language: string;
  feature: string;
}) {
  const code =
    codes[feature as keyof typeof codes][
      language as keyof (typeof codes)[keyof typeof codes]
    ];

  const [copied, setCopied] = useState(false);
  const copiedTimeout = useRef<number>(-1);

  return (
    <button
      className={cn(
        "rounded-full block relative before:inside-border group transition-colors",
        {
          "before:border-border-faint hover:bg-border-faint": !copied,
          "before:border-transparent text-heat-100 bg-heat-8": copied,
        },
      )}
      onClick={() => {
        copy(code);

        setCopied(true);

        copiedTimeout.current = window.setTimeout(() => setCopied(false), 2000);
      }}
    >
      <AnimatedWidth initial={{ width: "auto" }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            className="flex gap-4 items-center py-12 px-24"
            exit={{ opacity: 0, filter: "blur(2px)", scale: 0.9 }}
            initial={{ opacity: 0, filter: "blur(2px)", scale: 0.95 }}
            key={copied ? "copied" : "copy"}
          >
            <div
              className={cn(
                copied
                  ? "text-heat-100"
                  : "text-black-alpha-64 group-hover:text-accent-black transition-colors",
              )}
            >
              {copied ? <CopiedIcon /> : <CopyIcon />}
            </div>
            <div className="px-4 text-label-medium">
              {copied ? "Copied!" : "Copy code"}
            </div>
          </motion.div>
        </AnimatePresence>
      </AnimatedWidth>
    </button>
  );
}
