import { SiteHeader } from "@/components/blocks/site-header";
import { HeroSceneSwitcher } from "@/components/blocks/hero-scene-switcher";
import { BrandStatement } from "@/components/blocks/brand-statement";
import { SolutionsGrid } from "@/components/blocks/solutions-grid";
import { DesignerPromo } from "@/components/blocks/designer-promo";
import { AppAndControl } from "@/components/blocks/app-and-control";
import { SpecBlock } from "@/components/blocks/spec-block";
import { ServiceArea } from "@/components/blocks/service-area";
import { Proof } from "@/components/blocks/proof";
import { SiteFooter } from "@/components/blocks/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSceneSwitcher />
        <DesignerPromo />
        <BrandStatement />
        <SolutionsGrid />
        <AppAndControl />
        <SpecBlock />
        <ServiceArea />
        <Proof />
      </main>
      <SiteFooter />
    </>
  );
}
