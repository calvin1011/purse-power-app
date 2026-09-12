import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Check, Clock, Info, List, MapPin, Navigation, Repeat2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { deals, money } from "@/lib/mock-data";
import type { Deal } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deals/")({
  head: () => ({
    meta: [
      { title: "Deals for you · Sift" },
      { name: "description", content: "Personalized deals, smart swaps and timely savings based on your receipts." },
      { property: "og:title", content: "Deals for you · Sift" },
      { property: "og:description", content: "Recommendations connected to the products and places you regularly buy." },
    ],
  }),
  component: DealsScreen,
});

const categories = ["All", "Groceries", "Dining", "Household", "Personal Care"] as const;
type Filter = (typeof categories)[number];

function DealsScreen() {
  const [view, setView] = useState<"list" | "map">("list");
  const [category, setCategory] = useState<Filter>("All");
  const [tab, setTab] = useState<"feed" | "saved">("feed");
  const { savedDeals, locationOn, setLocationOn } = useApp();
  const relevantDeals = deals.filter((deal) => category === "All" || deal.category === category);
  const saved = relevantDeals.filter((deal) => savedDeals.includes(deal.id));

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-5 pt-10">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="mt-1 text-sm text-muted-foreground">Picked from your purchase history</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/search" aria-label="Search deals" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
            <Search className="h-4.5 w-4.5" />
          </Link>
          <div className="flex rounded-full border border-border bg-card p-1">
            {(["map", "list"] as const).map((option) => (
              <button key={option} onClick={() => setView(option)} aria-label={`${option} view`} className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-colors", view === option ? "money-fill" : "text-muted-foreground")}>
                {option === "map" ? <MapPin className="h-4.5 w-4.5" /> : <List className="h-4.5 w-4.5" />}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-5">
        {categories.map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium", category === item ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground")}>
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2 px-5">
        {(["feed", "saved"] as const).map((item) => (
          <button key={item} onClick={() => setTab(item)} className={cn("flex flex-1 items-center justify-center gap-2 rounded-2xl border py-2.5 text-sm font-semibold transition-colors", tab === item ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground")}>
            {item === "feed" ? "For You" : "Saved Deals"}
            {item === "saved" && saved.length > 0 && <span className="money-fill rounded-full px-1.5 py-0.5 text-[10px] font-bold">{saved.length}</span>}
          </button>
        ))}
      </div>

      {!locationOn ? (
        <div className="px-5 pt-16 text-center">
          <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl"><MapPin className="h-10 w-10 text-primary" /></div>
          <p className="mt-6 text-lg font-semibold">Enable location for relevant deals nearby</p>
          <p className="mt-2 text-sm text-muted-foreground">We only map offers connected to your purchase history.</p>
          <button onClick={() => { setLocationOn(true); toast.success("Location on · found relevant deals nearby"); }} className="money-fill mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold">Enable location</button>
        </div>
      ) : tab === "saved" ? (
        <SavedDeals deals={saved} onBrowse={() => setTab("feed")} />
      ) : (
        <DealsFeed view={view} deals={relevantDeals} />
      )}
    </MobileShell>
  );
}

function DealsFeed({ view, deals: visibleDeals }: { view: "list" | "map"; deals: Deal[] }) {
  const regular = visibleDeals.filter((deal) => deal.kind === "regular");
  const swaps = visibleDeals.filter((deal) => deal.kind === "swap");
  const upcoming = visibleDeals.filter((deal) => deal.kind === "upcoming");
  return (
    <>
      {view === "map" && <MapPanel deals={visibleDeals} />}
      <DealSection title="Deals on Your Regulars" subtitle="Offers on items you frequently purchase" deals={regular} horizontal />
      <DealSection title="Smart Swaps" subtitle="Cheaper alternatives to things you already buy" deals={swaps} />
      <DealSection title="Coming Up Soon" subtitle="Timed around when you usually restock" deals={upcoming} />
      {visibleDeals.length === 0 && <p className="px-5 pt-16 text-center text-sm text-muted-foreground">No tracked items match this category yet.</p>}
    </>
  );
}

function DealSection({ title, subtitle, deals: sectionDeals, horizontal = false }: { title: string; subtitle: string; deals: Deal[]; horizontal?: boolean }) {
  if (sectionDeals.length === 0) return null;
  return (
    <section className="pt-9">
      <div className="px-5"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>
      <div className={cn("mt-4 gap-3 px-5", horizontal ? "no-scrollbar flex overflow-x-auto" : "space-y-3")}>
        {sectionDeals.map((deal) => <DealCard key={deal.id} deal={deal} compact={horizontal} />)}
      </div>
    </section>
  );
}

function SavedDeals({ deals: saved, onBrowse }: { deals: Deal[]; onBrowse: () => void }) {
  if (saved.length === 0) return (
    <div className="px-5 pt-14 text-center">
      <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl"><Bookmark className="h-10 w-10 text-primary" /></div>
      <p className="mt-6 text-lg font-semibold">No saved deals yet</p>
      <p className="mt-2 text-sm text-muted-foreground">Save a recommendation and it'll wait for you here.</p>
      <button onClick={onBrowse} className="money-fill mt-6 inline-flex rounded-2xl px-6 py-3.5 font-semibold">Browse deals</button>
    </div>
  );
  return <div className="mt-5 space-y-3 px-5">{saved.map((deal) => <DealCard key={deal.id} deal={deal} />)}</div>;
}

function MapPanel({ deals: mapDeals }: { deals: Deal[] }) {
  return (
    <div className="relative mx-5 mt-6 h-56 overflow-hidden rounded-3xl border border-border bg-elevated">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
      {mapDeals.map((deal) => (
        <Link key={deal.id} to="/deals/$dealId" params={{ dealId: deal.id }} aria-label={`${deal.title} at ${deal.merchant}`} className="money-fill glow absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full" style={{ top: deal.mapPosition.top, left: deal.mapPosition.left }}>
          <MapPin className="h-4 w-4" />
        </Link>
      ))}
      <div className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur"><Navigation className="mr-1 inline h-3 w-3" /> Only deals matched to you</div>
    </div>
  );
}

function DealCard({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  const { savedDeals, toggleDeal } = useApp();
  const [showReason, setShowReason] = useState(false);
  const saved = savedDeals.includes(deal.id);
  return (
    <article className={cn("surface-card rounded-3xl p-4", compact && "w-64 shrink-0")}>
      <Link to="/deals/$dealId" params={{ dealId: deal.id }} className="flex items-start gap-3">
        <StoreAvatar name={deal.merchant} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{deal.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{deal.merchant}</p>
          {deal.kind === "swap" && deal.currentItem && <p className="mt-2 text-xs text-muted-foreground">You buy: {deal.currentItem} {money(deal.currentPrice ?? 0)}<br />Try: {deal.suggestedItem} {money(deal.suggestedPrice ?? 0)}</p>}
          {deal.kind === "swap" && <p className="mt-2 text-sm font-semibold text-primary">Save {money(deal.weeklySavings ?? 0)}/week</p>}
          {deal.timing && <span className="mt-2 inline-flex rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">{deal.timing}</span>}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {deal.distance}</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {deal.expires}</span></div>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
        <button onClick={() => setShowReason((value) => !value)} className="flex items-center gap-1 text-xs font-semibold text-primary"><Info className="h-3.5 w-3.5" /> Why this deal?</button>
        <span className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary">{deal.relevanceTag}</span>
      </div>
      {showReason && <div className="mt-3 flex gap-2 rounded-2xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /><span>{deal.reason}</span><button onClick={() => setShowReason(false)} aria-label="Close explanation" className="ml-auto"><X className="h-3.5 w-3.5" /></button></div>}
      {!compact && <button onClick={() => toggleDeal(deal.id)} className={cn("mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-colors", saved ? "bg-primary/15 text-primary" : "money-fill")}>
        {saved ? <><Check className="h-4 w-4" /> Saved · Use Deal</> : <><Bookmark className="h-4 w-4" /> Save Deal</>}
      </button>}
    </article>
  );
}