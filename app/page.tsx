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

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSceneSwitcher />
        <SolutionsGrid />

        <DiscreetFromStreet />
        <AppAndControl />
        <RecurringCost />
        <SpecBlock />
        <Process />
        <ServiceArea />
        <Proof />
        {/* C11 FAQ — deferred */}
        {/* C12 Quote form */}
      </main>
      <SiteFooter />
    </>
  );
}
