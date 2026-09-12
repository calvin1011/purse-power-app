import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Check, Clock, Flame, List, MapPin, Navigation, Search } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { deals } from "@/lib/mock-data";
import type { Category, Deal } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deals/")({
  head: () => ({
    meta: [
      { title: "Deals near you · Sift" },
      {
        name: "description",
        content: "Browse trending and personalized deals from stores and restaurants nearby.",
      },
      { property: "og:title", content: "Deals near you · Sift" },
      {
        property: "og:description",
        content: "Map and list of nearby offers across food, grocery, retail and services.",
      },
    ],
  }),
  component: DealsScreen,
});

const cats: (Category | "All")[] = ["All", "Dining", "Grocery", "Retail", "Services"];

function DealsScreen() {
  const [view, setView] = useState<"list" | "map">("list");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [tab, setTab] = useState<"feed" | "saved">("feed");
  const { savedDeals, locationOn, setLocationOn } = useApp();

  const filtered = deals.filter((d) => (cat === "All" ? true : d.category === cat));
  const saved = deals.filter((d) => savedDeals.includes(d.id));

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-10">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="mt-1 text-sm text-muted-foreground">Deals within 3 miles of you</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/search"
            aria-label="Search deals"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
          <div className="flex rounded-full border border-border bg-card p-1">
            {(["map", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  view === v ? "money-fill" : "text-muted-foreground",
                )}
              >
                {v === "map" ? (
                  <MapPin className="h-4.5 w-4.5" />
                ) : (
                  <List className="h-4.5 w-4.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-6 flex gap-2 px-5">
        {(["feed", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold transition-colors",
              tab === t
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {t === "feed" ? "All Deals" : "Saved Deals"}
            {t === "saved" && saved.length > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  tab === "saved" ? "money-fill" : "bg-muted text-muted-foreground",
                )}
              >
                {saved.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {!locationOn ? (
        <div className="px-5 pt-16 text-center">
          <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-6 text-lg font-semibold">Enable location to see deals near you</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We only use it to find offers within a few miles, never to track you.
          </p>
          <button
            onClick={() => {
              setLocationOn(true);
              toast.success("Location on · found 8 deals nearby");
            }}
            className="money-fill mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold"
          >
            Enable location
          </button>
        </div>
      ) : tab === "saved" ? (
        <div className="mt-4 space-y-3 px-5">
          {saved.map((d) => (
            <DealCard key={`s-${d.id}`} deal={d} />
          ))}
          {saved.length === 0 && (
            <div className="pt-14 text-center">
              <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
                <Bookmark className="h-10 w-10 text-primary" />
              </div>
              <p className="mt-6 text-lg font-semibold">No saved deals yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap Save Deal on anything you like and it'll wait for you here.
              </p>
              <button
                onClick={() => setTab("feed")}
                className="money-fill mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold"
              >
                Browse deals
              </button>
            </div>
          )}
        </div>
      ) : (
        <DealsFeed
          view={view}
          cat={cat}
          setCat={setCat}
          filtered={filtered}
        />
      )}
    </MobileShell>
  );
}

function DealsFeed({
  view,
  cat,
  setCat,
  filtered,
}: {
  view: "list" | "map";
  cat: (typeof cats)[number];
  setCat: (c: (typeof cats)[number]) => void;
  filtered: Deal[];
}) {
  return (
    <>
      {view === "map" && <MapPanel />}

      <section className="pt-8">
        <div className="flex items-center gap-2 px-5">
          <Flame className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Trending Deals</h2>
        </div>
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5">
          {deals
            .filter((d) => d.trending)
            .map((d) => (
              <Link
                key={d.id}
                to="/deals/$dealId"
                params={{ dealId: d.id }}
                className="surface-card w-56 shrink-0 rounded-3xl p-4"
              >
                <StoreAvatar name={d.merchant} size="sm" />
                <p className="mt-3 font-semibold leading-snug">{d.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {d.saves.toLocaleString()} people saved this
                </p>
              </Link>
            ))}
        </div>
      </section>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium",
              cat === c
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5">
        {filtered.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>

      <section className="pt-10">
        <h2 className="px-5 text-lg font-semibold">Based on Your Purchases</h2>
        <p className="px-5 pt-1 text-sm text-muted-foreground">
          Picked from the stores you scan most
        </p>
        <div className="mt-4 space-y-3 px-5">
          {deals
            .filter((d) => d.personalized)
            .map((d) => (
              <DealCard key={`p-${d.id}`} deal={d} />
            ))}
        </div>
      </section>
    </>
  );
}

function MapPanel() {
  return (
    <div className="relative mx-5 mt-6 h-56 overflow-hidden rounded-3xl border border-border bg-elevated">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      {[
        { t: "22%", l: "18%" },
        { t: "48%", l: "62%" },
        { t: "66%", l: "30%" },
        { t: "30%", l: "78%" },
      ].map((p, i) => (
        <span
          key={i}
          className="money-fill glow absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ top: p.t, left: p.l }}
        >
          <MapPin className="h-4 w-4" />
        </span>
      ))}
      <div className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
        <Navigation className="mr-1 inline h-3 w-3" /> Deep Ellum, Dallas
      </div>
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const { savedDeals, toggleDeal } = useApp();
  const saved = savedDeals.includes(deal.id);
  return (
    <div className="surface-card rounded-3xl p-4">
      <Link
        to="/deals/$dealId"
        params={{ dealId: deal.id }}
        className="flex items-start gap-3"
      >
        <StoreAvatar name={deal.merchant} />
        <div className="flex-1">
          <div className="font-semibold">{deal.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{deal.merchant}</div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {deal.distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {deal.expires}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleDeal(deal.id)}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-colors",
          saved ? "bg-primary/15 text-primary" : "money-fill",
        )}
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" /> Saved · Use Deal
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" /> Save Deal
          </>
        )}
      </button>
    </div>
  );
}
