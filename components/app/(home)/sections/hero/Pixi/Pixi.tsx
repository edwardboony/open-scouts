"use client";

import Pixi from "@/components/shared/pixi/Pixi";

import features from "./tickers/features";

export default function HomeHeroPixi() {
  return (
    <Pixi
      canvasAttrs={{
        className: "cw-[1314px] h-506 absolute top-100 lg-max:hidden",
      }}
      fps={Infinity}
      initOptions={{ backgroundAlpha: 0 }}
      smartStop={false}
      tickers={[features]}
    />
  );
}
