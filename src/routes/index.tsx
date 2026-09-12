import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Receipt } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sift — Stop leaving money on the table" },
      {
        name: "description",
        content:
          "Scan any receipt and instantly see savings you missed, cheaper options nearby, and deals for your next visit.",
      },
      { property: "og:title", content: "Sift — Stop leaving money on the table" },
      {
        property: "og:description",
        content: "Scan any receipt. Find instant savings across every store and restaurant.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-6 pb-10 pt-16 screen-in">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-muted-foreground">
        <Receipt className="h-4 w-4 text-primary" />
        SIFT
      </div>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <div className="absolute h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="surface-card relative w-64 rotate-[-6deg] rounded-3xl p-5">
          <div className="text-xs text-muted-foreground">TARGET · TODAY</div>
          <div className="mt-3 space-y-2">
            {["Tide Pods 42ct", "Paper Towels 6pk", "Greek Yogurt 4pk"].map((i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{i}</span>
                <span className="h-3 w-10 rounded-full bg-muted" />
              </div>
            ))}
          </div>
          <div className="money-fill mt-5 rounded-2xl px-4 py-3 text-sm font-semibold">
            $8.20 you missed
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold leading-tight">
          Stop leaving <span className="money-text">money</span> on the table.
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Scan any receipt. Find instant savings.
        </p>
        <Link
          to="/onboarding/value"
          className="money-fill glow mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold transition-transform active:scale-[0.98]"
        >
          Get Started <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
