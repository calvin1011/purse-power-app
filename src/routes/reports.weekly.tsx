import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Share2, Tag, TrendingDown } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { StoreAvatar } from "@/components/StoreAvatar";
import { money, reportCategoryColor, weeklyReport } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/weekly")({
  head: () => ({
    meta: [
      { title: "Weekly savings report — Sift" },
      {
        name: "description",
        content:
          "How much you saved this week, daily spending by category, and the deals you narrowly missed.",
      },
      { property: "og:title", content: "Weekly savings report — Sift" },
      {
        property: "og:description",
        content: "Your week in savings: totals, category breakdown and missed opportunities.",
      },
    ],
  }),
  component: WeeklyReport,
});

function WeeklyReport() {
  const r = weeklyReport;
  const diff = r.saved - r.lastWeekSaved;
  const up = diff >= 0;
  const max = Math.max(...r.days.map((d) => d.spent), 1);
  const totalSpent = r.breakdown.reduce((a, b) => a + b.amount, 0);

  return (
    <MobileShell>
      <header className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-semibold">Weekly report</span>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">Saved this week</p>
        <div className="mt-2 flex items-end gap-3">
          <span className="money-text text-5xl font-bold tracking-tight">{money(r.saved)}</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-sm font-semibold text-primary">
          {up ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {up ? "Up" : "Down"} {money(Math.abs(diff))} from last week
        </div>
      </header>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">Daily spending</h2>
        <div className="surface-card mt-4 rounded-3xl p-5">
          <div className="flex h-40 items-end justify-between gap-2">
            {r.days.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {d.spent > 0 ? Math.round(d.spent) : ""}
                </span>
                <div
                  className="w-full rounded-t-xl"
                  style={{
                    height: `${Math.max(4, (d.spent / max) * 110)}px`,
                    background: reportCategoryColor[d.category],
                    opacity: d.spent > 0 ? 1 : 0.25,
                  }}
                />
                <span className="text-[11px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
            {(["Dining", "Grocery", "Retail", "Other"] as const).map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: reportCategoryColor[c] }}
                />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">Spending by category</h2>
        <div className="surface-card mt-4 space-y-4 rounded-3xl p-5">
          {r.breakdown.map((b) => {
            const pct = Math.round((b.amount / totalSpent) * 100);
            return (
              <div key={b.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.category}</span>
                  <span className="text-muted-foreground">
                    {money(b.amount)} · {pct}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: reportCategoryColor[b.category] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">Savings opportunities missed</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deals that matched purchases you made this week
        </p>
        <div className="mt-4 space-y-3">
          {r.missed.map((m) => (
            <Link
              key={m.id}
              to="/deals/$dealId"
              params={{ dealId: m.dealId }}
              className="surface-card flex items-start gap-3 rounded-3xl p-4 transition-transform active:scale-[0.99]"
            >
              <StoreAvatar name={m.store} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{m.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.detail}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" /> {m.store}
                </span>
              </div>
              <span className="money-text font-bold">{money(m.amount)}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="px-5 pt-10">
        <button
          onClick={() => toast.success("Savings card created — ready to share")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 font-semibold transition-transform active:scale-[0.98]"
        >
          <Share2 className="h-5 w-5" /> Share my savings
        </button>
      </div>
    </MobileShell>
  );
}
