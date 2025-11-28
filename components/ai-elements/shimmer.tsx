"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { type CSSProperties, type ElementType, memo, useMemo } from "react";

export type TextShimmerProps = {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

// Pre-created motion components to avoid creating components during render
const MotionP = motion.p;
const MotionSpan = motion.span;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionH3 = motion.h3;

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => {
  const MotionComponent = useMemo(() => {
    switch (Component) {
      case "span":
        return MotionSpan;
      case "div":
        return MotionDiv;
      case "h1":
        return MotionH1;
      case "h2":
        return MotionH2;
      case "h3":
        return MotionH3;
      case "p":
      default:
        return MotionP;
    }
  }, [Component]);

  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread],
  );

  const sharedProps = {
    animate: { backgroundPosition: "0% center" },
    className: cn(
      "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
      "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
      className,
    ),
    initial: { backgroundPosition: "100% center" },
    style: {
      "--spread": `${dynamicSpread}px`,
      backgroundImage:
        "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
    } as CSSProperties,
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration,
      ease: "linear" as const,
    },
  };

  return <MotionComponent {...sharedProps}>{children}</MotionComponent>;
};

export const Shimmer = memo(ShimmerComponent);
