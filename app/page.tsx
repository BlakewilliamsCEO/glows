import { SiteHeader } from "@/components/blocks/site-header";
import { HeroSceneSwitcher } from "@/components/blocks/hero-scene-switcher";
import { BrandStatement } from "@/components/blocks/brand-statement";
import { SolutionsGrid } from "@/components/blocks/solutions-grid";
import { AppAndControl } from "@/components/blocks/app-and-control";
import { SpecBlock } from "@/components/blocks/spec-block";
import { Process } from "@/components/blocks/process";
import { ServiceArea } from "@/components/blocks/service-area";
import { Proof } from "@/components/blocks/proof";
import { SiteFooter } from "@/components/blocks/site-footer";
import { SectionDivider } from "@/components/section-divider";

const DARK = "#141C2F";
const CREAM = "#F1EDE8";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSceneSwitcher />
        <SectionDivider bg="transparent" fill={CREAM} />

        <BrandStatement />

        <SolutionsGrid />
        <SectionDivider bg={CREAM} fill={DARK} />

        <AppAndControl />
        <SectionDivider bg={DARK} fill={CREAM} flip />

        <SpecBlock />
        <SectionDivider bg={CREAM} fill={DARK} />

        <ServiceArea />
        <SectionDivider bg={DARK} fill={CREAM} flip />

        <Proof />
        <SectionDivider bg={CREAM} fill={DARK} />
      </main>
      <SiteFooter />
    </>
  );
}
