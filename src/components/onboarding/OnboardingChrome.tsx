import { AppHeader } from "../layout/AppHeader";

type OnboardingChromeProps = {
  children: React.ReactNode;
};

export function OnboardingChrome({ children }: OnboardingChromeProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-teal-100">
      <AppHeader simple />
      <main className="flex flex-1 justify-center px-4 pb-16 pt-12 md:px-[60px] md:pt-20">
        <div className="w-full max-w-[1000px]">{children}</div>
      </main>
    </div>
  );
}

export function OnboardingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-8 rounded-[20px] border border-gray-300 bg-white p-6 md:p-12">
      {children}
    </div>
  );
}
