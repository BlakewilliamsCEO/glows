import { SiteHeader } from "@/components/blocks/site-header";
import { HeroSceneSwitcher } from "@/components/blocks/hero-scene-switcher";
import { SolutionsGrid } from "@/components/blocks/solutions-grid";
import { DiscreetFromStreet } from "@/components/blocks/discreet-from-street";
import { AppAndControl } from "@/components/blocks/app-and-control";
import { RecurringCost } from "@/components/blocks/recurring-cost";
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

        <SolutionsGrid />
        <SectionDivider bg={CREAM} fill={DARK} />

        <DiscreetFromStreet />
        <AppAndControl />
        <SectionDivider bg={DARK} fill={CREAM} flip />

        <RecurringCost />
        <SectionDivider bg={CREAM} fill={DARK} />

        <SpecBlock />
        <SectionDivider bg={DARK} fill={CREAM} flip />

        <Process />
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
