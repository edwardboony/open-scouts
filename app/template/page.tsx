import Testimonials from "@/components/app/(home)/sections/testimonials/Testimonials";
import Ai from "@/components/app/(home)/sections/ai/Ai";
import Core from "@/components/app/(home)/sections/core/Core";
import Developer from "@/components/app/(home)/sections/developer/Developer";
import Features from "@/components/app/(home)/sections/features/Features";
import HomeHero from "@/components/app/(home)/sections/hero/Hero";
import DividerCta from "@/components/shared/divider-cta/DividerCta";
import { Connector } from "@/components/shared/layout/curvy-rect";
import Logocloud from "@/components/shared/logo-cloud/Logocloud";
import SectionTitle from "@/components/shared/section-title/SectionTitle";
import { CurvyRect } from "@/components/shared/ui";
import Faq from "@/components/app/(home)/sections/faq/Faq";
import HomePricingClientWrapper from "@/components/app/(home)/sections/pricing-section/client-wrapper";

const max = 7;

export default function Home() {
  let i = 0;

  return (
    <>
      <HomeHero />

      <div className="h-52 lg:mt-51 relative container">
        <CurvyRect className="overlay" bottom />
        <CurvyRect className="overlay lg-max:hidden" top />
      </div>

      <div className="h-1 bg-border-faint lg-max:hidden container -mt-1" />

      <Logocloud />
      <SectionTitle index={++i} max={max} title="Main Features" />

      <Developer />

      <SectionTitle index={++i} max={max} title="Core" />

      <Core />

      <div className="h-92 lg:h-160 -mt-1 relative container">
        <div className="h-1 top-0 absolute w-screen left-[calc(50%-50vw)] bg-border-faint" />
        <div className="h-1 bottom-0 absolute w-screen left-[calc(50%-50vw)] bg-border-faint" />

        <Connector className="absolute -top-[10px] -left-[10.5px]" />
        <Connector className="absolute -top-[10px] -right-[10.5px]" />
        <Connector className="absolute -bottom-[10px] -left-[10.5px]" />
        <Connector className="absolute -bottom-[10px] -right-[10.5px]" />
      </div>

      <DividerCta />
      <SectionTitle index={++i} max={max} title="Features" />

      <Features />

      <SectionTitle index={++i} max={max} title="Pricing" />

      <HomePricingClientWrapper />

      <SectionTitle index={++i} max={max} title="Testimonials" />

      <Testimonials />

      <SectionTitle index={++i} max={max} title="Use Cases" />

      <Ai />

      <div className="h-92 lg:h-160 -mt-1 relative container">
        <div className="h-1 top-0 absolute w-screen left-[calc(50%-50vw)] bg-border-faint" />
        <div className="h-1 bottom-0 absolute w-screen left-[calc(50%-50vw)] bg-border-faint" />
        <Connector className="absolute -top-[10px] -left-[10.5px]" />
        <Connector className="absolute -top-[10px] -right-[10.5px]" />
        <Connector className="absolute -bottom-[10px] -left-[10.5px]" />
        <Connector className="absolute -bottom-[10px] -right-[10.5px]" />
      </div>

      <DividerCta flameVariant={1} />

      <SectionTitle index={++i} max={max} title="FAQ" />

      <Faq />
    </>
  );
}
