import { BelongSection } from "../components/landing/BelongSection";
import { DiscoveryHero } from "../components/landing/DiscoveryHero";
import { LandingFaq } from "../components/landing/LandingFaq";
import { LandingFooter } from "../components/landing/LandingFooter";
import { LandingHeader } from "../components/landing/LandingHeader";
import { NeighborhoodSpaces } from "../components/landing/NeighborhoodSpaces";
import { UpcomingPopups } from "../components/landing/UpcomingPopups";

export function LandingPage() {
  return (
    <div className="bg-white">
      <LandingHeader />
      <DiscoveryHero />
      <NeighborhoodSpaces />
      <UpcomingPopups />
      <LandingFaq />
      <BelongSection />
      <LandingFooter />
    </div>
  );
}
