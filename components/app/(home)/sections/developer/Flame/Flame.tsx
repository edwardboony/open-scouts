"use client";

import { HTMLAttributes, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import data from "./data.json";
import { setIntervalOnVisible } from "@/utils/set-timeout-on-visible";

export default function DeveloperFlame(attrs: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;

    const interval = setIntervalOnVisible({
      element: wrapperRef.current as HTMLElement,
      callback: () => {
        index++;
        if (index >= data.length) index = 0;

        const newStr = data[index];

        ref.current!.innerHTML = newStr;
      },
      interval: 50,
    });

    return () => interval?.();
  }, []);

  return (
    <div className="absolute inset-10 overflow-clip">
      <div
        ref={wrapperRef}
        {...attrs}
        className={cn(
          "cw-[1112px] ch-500 absolute pointer-events-none select-none",
          attrs.className,
        )}
      >
        <div
          className="text-black-alpha-32 relative -left-100 font-ascii fc-decoration"
          ref={ref}
          style={{
            whiteSpace: "pre",
            fontSize: 8,
            lineHeight: "8px",
          }}
        />
      </div>
    </div>
  );
}
