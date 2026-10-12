import { useLocation } from "react-router-dom";
import { BelongSection } from "../components/landing/BelongSection";
import { DiscoveryHero } from "../components/landing/DiscoveryHero";
import { LandingFaq } from "../components/landing/LandingFaq";
import { LandingFooter } from "../components/landing/LandingFooter";
import { LandingHeader } from "../components/landing/LandingHeader";
import { NeighborhoodSpaces } from "../components/landing/NeighborhoodSpaces";
import { UpcomingPopups } from "../components/landing/UpcomingPopups";
import { VENDORS_HOME, type DiscoveryAudience } from "../lib/discoveryHome";

type LandingPageProps = {
  audience?: DiscoveryAudience;
};

export function LandingPage({ audience }: LandingPageProps) {
  const { pathname } = useLocation();
  const resolvedAudience: DiscoveryAudience =
    audience ?? (pathname.startsWith(VENDORS_HOME) ? "vendors" : "venues");

  return (
    <div className="bg-white">
      <LandingHeader />
      <DiscoveryHero key={resolvedAudience} audience={resolvedAudience} />
      <NeighborhoodSpaces audience={resolvedAudience} />
      <UpcomingPopups audience={resolvedAudience} />
      <LandingFaq audience={resolvedAudience} />
      <BelongSection audience={resolvedAudience} />
      <LandingFooter />
    </div>
  );
}
