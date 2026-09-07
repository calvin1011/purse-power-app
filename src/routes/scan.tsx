import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Image, X, Zap } from "lucide-react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a receipt — Sift" },
      {
        name: "description",
        content: "Point your camera at any receipt and Sift finds the savings you missed.",
      },
      { property: "og:title", content: "Scan a receipt — Sift" },
      {
        property: "og:description",
        content: "Capture a receipt from any store or restaurant to uncover instant savings.",
      },
    ],
  }),
  component: ScanScreen,
});

const steps = ["Reading your receipt…", "Comparing prices nearby…", "Finding your savings…"];

function ScanScreen() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!processing) return;
    const a = setTimeout(() => setStep(1), 900);
    const b = setTimeout(() => setStep(2), 1800);
    const c = setTimeout(() => navigate({ to: "/scan/results" }), 2900);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, [processing, navigate]);

  if (processing) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-8 px-8">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <div className="absolute h-32 w-32 animate-ping rounded-full bg-primary/20" />
          <div className="money-fill glow flex h-20 w-20 items-center justify-center rounded-full">
            <Zap className="h-9 w-9" />
          </div>
        </div>
        <p className="text-lg font-semibold">{steps[step]}</p>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
          <div
            className="money-fill h-full rounded-full transition-all duration-700"
            style={{ width: `${(step + 1) * 33.4}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-8">
        <button
          onClick={() => navigate({ to: "/home" })}
          aria-label="Close scanner"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">Scan Receipt</span>
        <button
          aria-label="Pick from library"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <Image className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="relative aspect-[3/4.4] w-full max-w-[280px] rounded-3xl bg-elevated">
          <Corner className="left-0 top-0 rounded-tl-3xl border-l-2 border-t-2" />
          <Corner className="right-0 top-0 rounded-tr-3xl border-r-2 border-t-2" />
          <Corner className="bottom-0 left-0 rounded-bl-3xl border-b-2 border-l-2" />
          <Corner className="bottom-0 right-0 rounded-br-3xl border-b-2 border-r-2" />
          <div className="absolute inset-x-8 top-10 space-y-3 opacity-40">
            {[100, 70, 85, 55, 90, 40].map((w, i) => (
              <div key={i} className="h-2.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>

      <p className="px-10 text-center text-sm text-muted-foreground">
        Line the receipt up inside the frame. Crumpled and faded ones work too.
      </p>

      <div className="flex items-center justify-center py-12">
        <button
          onClick={() => setProcessing(true)}
          aria-label="Capture receipt"
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/40 transition-transform active:scale-95"
        >
          <span className="money-fill glow h-16 w-16 rounded-full" />
        </button>
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-10 w-10 border-primary ${className}`} />;
}
