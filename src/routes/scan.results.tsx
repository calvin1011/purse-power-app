import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bookmark, Camera, Check, MapPin, Share2, Sparkles, Tag } from "lucide-react";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { money, scannedReceipt } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/scan/results")({
  head: () => ({
    meta: [
      { title: "Savings found · Sift" },
      {
        name: "description",
        content: "Your receipt breakdown plus every saving, cheaper alternative and missed deal.",
      },
      { property: "og:title", content: "Savings found · Sift" },
      {
        property: "og:description",
        content: "See exactly what you could have saved on this purchase.",
      },
    ],
  }),
  component: Results,
});

function Results() {
  const r = scannedReceipt;
  const { addReceipt } = useApp();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<string[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const found = r.savings.reduce((a, s) => a + s.amount, 0);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32 screen-in">
      <div className="flex items-center gap-3 px-5 pt-8">
        <Link
          to="/home"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-semibold">Scan results</span>
      </div>

      <section className="surface-card mx-5 mt-6 rounded-3xl p-5">
        <div className="flex items-center gap-3">
          <StoreAvatar name={r.store} />
          <div className="flex-1">
            <div className="font-semibold">{r.store}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(r.date).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="text-xl font-bold">{money(r.total)}</div>
        </div>
        <div className="mt-5 space-y-2 border-t border-border pt-4">
          {r.items.map((i) => (
            <div key={i.name} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {i.qty > 1 && `${i.qty}× `}
                {i.name}
              </span>
              <span>{money(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
      </section>

      {found > 0 ? (
        <section className="mt-8 px-5">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Savings Found</h2>
            <span className="money-text ml-auto text-lg font-bold">{money(found)}</span>
          </div>
          <div className="mt-4 space-y-3">
            {r.savings.map((s) => (
              <div key={s.id} className="surface-card rounded-3xl p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    {s.kind === "missed-deal" ? (
                      <Tag className="h-4.5 w-4.5" />
                    ) : (
                      <MapPin className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold leading-snug">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.detail}</p>
                    {s.distance && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {s.store} · {s.distance}
                      </p>
                    )}
                    {s.kind === "missed-deal" && (
                      <button
                        onClick={() => {
                          setSaved((v) => [...v, s.id]);
                          toast.success("Saved for your next visit");
                        }}
                        className="mt-3 flex items-center gap-2 rounded-full bg-primary/15 px-3 py-2 text-sm font-semibold text-primary"
                      >
                        {saved.includes(s.id) ? (
                          <>
                            <Check className="h-4 w-4" /> Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-4 w-4" /> Save for next time
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <span className="money-text font-bold">{money(s.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="surface-card mx-5 mt-8 rounded-3xl p-6 text-center">
          <p className="font-semibold">No savings this time</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We're learning your habits. Keep scanning!
          </p>
        </section>
      )}

      {celebrating && <Confetti />}

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-8">
        <button
          onClick={() => {
            if (celebrating) return;
            setCelebrating(true);
            addReceipt({ ...r, id: `scan-${Date.now()}` });
            setTimeout(() => {
              toast.success("Receipt saved to your vault");
              navigate({ to: "/receipts" });
            }, 1150);
          }}
          className="money-fill glow w-full rounded-2xl py-4 font-semibold transition-transform active:scale-[0.98]"
        >
          {celebrating ? `Nice · ${money(found)} found!` : "Save Receipt"}
        </button>
        <div className="mt-3 flex gap-3">
          <Link
            to="/scan"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold"
          >
            <Camera className="h-4.5 w-4.5" /> Scan another
          </Link>
          <button
            onClick={() => toast("Savings summary copied · share away")}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold"
          >
            <Share2 className="h-4.5 w-4.5" /> Share Savings
          </button>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 26 }, (_, i) => i);
  const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-50 mx-auto h-0 max-w-md">
      {pieces.map((i) => (
        <span
          key={i}
          className="confetti-piece absolute block h-2.5 w-2.5 rounded-[3px]"
          style={{
            left: `${(i * 3.7) % 96}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 6) * 60}ms`,
            ["--dx" as string]: `${((i % 5) - 2) * 26}px`,
          }}
        />
      ))}
    </div>
  );
}
