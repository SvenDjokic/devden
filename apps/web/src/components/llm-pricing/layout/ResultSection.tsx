interface ResultSectionProps {
  children: React.ReactNode;
  showAdSlot?: boolean;
}

export function ResultSection({ children, showAdSlot = true }: ResultSectionProps) {
  return (
    <section className="space-y-6">
      {/* Result/Output Area */}
      <div className="bg-card border border-border rounded-lg p-6">
        {children}
      </div>

      {/* Ad Slot - appears after result (value-first approach) */}
      {showAdSlot && <AdSlot />}
    </section>
  );
}

function AdSlot() {
  return (
    <div className="ad-slot">
      <p className="ad-slot-label">Sponsor</p>
      {/*
        Ad Integration Instructions:

        Google AdSense:
        - Desktop (≥800px): 728×90 Leaderboard
        - Tablet (500-799px): 468×60 Banner
        - Mobile (<500px): 320×100 Large Mobile Banner

        Carbon Ads:
        - Single 130×100 image + 80 char text
        - Container max-width: 330px

        Replace this placeholder with your ad code.
      */}
      <div className="h-[90px] flex items-center justify-center text-muted-foreground text-sm">
        Ad placeholder
      </div>
    </div>
  );
}
