import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Camera, ChevronRight, Clock, Flame, MapPin, RefreshCw, Search } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { STREAK_DAYS, deals, money, notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Your savings dashboard — Sift" },
      {
        name: "description",
        content: "Track what you've saved, scan a new receipt, and see deals near you right now.",
      },
      { property: "og:title", content: "Your savings dashboard — Sift" },
      {
        property: "og:description",
        content: "Total saved, recent scans, nearby deals and your weekly spending snapshot.",
      },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { name, totalSaved, receipts, readNotifs } = useApp();
  const unread = notifications.filter((n) => !readNotifs.includes(n.id)).length;
  const [refreshing, setRefreshing] = useState(false);
  const [pull, setPull] = useState(0);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1100);
  };

  const week = receipts.slice(0, 4);
  const weekSpent = week.reduce((a, r) => a + r.total, 0);
  const weekSaved = week.reduce((a, r) => a + r.savings.reduce((x, s) => x + s.amount, 0), 0);

  return (
    <MobileShell>
      <div
        onTouchMove={(e) => {
          const y = e.touches[0]?.clientY ?? 0;
          if (window.scrollY <= 0) setPull(Math.min(70, y / 6));
        }}
        onTouchEnd={() => {
          if (pull > 40) refresh();
          setPull(0);
        }}
      >
        <div
          className="flex items-center justify-center overflow-hidden text-muted-foreground transition-all"
          style={{ height: refreshing ? 44 : pull }}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-primary" : ""}`} />
        </div>

        <header className="px-5 pt-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {name ? `Hey ${name},` : "Hey there,"}
              </p>
              <Link
                to="/streak"
                aria-label="Your scanning streak"
                className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary"
              >
                <Flame className="h-3.5 w-3.5" /> {STREAK_DAYS}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/search"
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground"
              >
                <Search className="h-5 w-5" />
              </Link>
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
            </div>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="money-text text-5xl font-bold tracking-tight">
              {money(totalSaved)}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">saved so far</p>
          <button
            onClick={refresh}
            className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Pull down to refresh
          </button>
        </header>

        <div className="px-5 pt-8">
          <Link
            to="/scan"
            className="money-fill glow flex w-full items-center justify-center gap-3 rounded-3xl py-6 text-lg font-bold transition-transform active:scale-[0.98]"
          >
            <Camera className="h-6 w-6" strokeWidth={2.3} />
            Scan Receipt
          </Link>
        </div>

        <section className="pt-10">
          <SectionHeader title="Deals Near You" to="/deals" />
          <div className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
            {deals.slice(0, 5).map((d) => (
              <Link
                key={d.id}
                to="/deals/$dealId"
                params={{ dealId: d.id }}
                className="surface-card w-60 shrink-0 snap-start rounded-3xl p-4 transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <StoreAvatar name={d.merchant} size="sm" />
                  <div className="text-sm font-semibold">{d.merchant}</div>
                </div>
                <p className="mt-3 text-base font-semibold leading-snug">{d.title}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {d.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {d.expires}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-10">
          <SectionHeader title="Your Recent Scans" to="/receipts" />
          <div className="mt-4 space-y-3 px-5">
            {receipts.slice(0, 4).map((r) => {
              const found = r.savings.reduce((a, s) => a + s.amount, 0);
              return (
                <Link
                  key={r.id}
                  to="/receipts/$receiptId"
                  params={{ receiptId: r.id }}
                  className="surface-card flex items-center gap-3 rounded-3xl p-4 transition-transform active:scale-[0.99]"
                >
                  <StoreAvatar name={r.store} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{r.store}</span>
                      <span className="font-semibold">{money(r.total)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {found > 0 && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          You missed {money(found)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="px-5 pt-10">
          <h2 className="text-lg font-semibold">Weekly Snapshot</h2>
          <Link
            to="/reports/weekly"
            className="surface-card mt-4 block rounded-3xl p-5 transition-transform active:scale-[0.99]"
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Spent" value={money(weekSpent)} />
              <Stat label="Receipts" value={String(week.length)} />
              <Stat label="Found" value={money(weekSaved)} accent />
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
              See your full weekly report <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </section>
      </div>
    </MobileShell>
  );
}

function SectionHeader({ title, to }: { title: string; to: "/deals" | "/receipts" }) {
  return (
    <div className="flex items-center justify-between px-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link to={to} className="flex items-center text-sm text-muted-foreground">
        See all <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-xl font-bold ${accent ? "money-text" : ""}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
