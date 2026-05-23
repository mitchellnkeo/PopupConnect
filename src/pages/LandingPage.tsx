import { BuiltForCollectiveSection } from "../components/landing/BuiltForCollectiveSection";
import { CommunityWaitingSection } from "../components/landing/CommunityWaitingSection";
import { HeroSection } from "../components/landing/HeroSection";
import { LandingFooter } from "../components/landing/LandingFooter";
import { WeHelpConnectSection } from "../components/landing/WeHelpConnectSection";

export function LandingPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <WeHelpConnectSection />
      <BuiltForCollectiveSection />
      <CommunityWaitingSection />
      <LandingFooter />
    </div>
  );
}
