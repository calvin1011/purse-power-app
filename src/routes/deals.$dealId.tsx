import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Check, Clock, MapPin, Navigation, Share2 } from "lucide-react";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { deals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/deals/$dealId")({
  head: () => ({
    meta: [
      { title: "Deal details — Sift" },
      {
        name: "description",
        content: "Deal terms, expiration, how to redeem, and directions to the merchant.",
      },
      { property: "og:title", content: "Deal details — Sift" },
      {
        property: "og:description",
        content: "Everything you need to redeem this offer on your next visit.",
      },
    ],
  }),
  component: DealDetail,
});

function DealDetail() {
  const { dealId } = useParams({ from: "/deals/$dealId" });
  const { savedDeals, toggleDeal } = useApp();
  const deal = deals.find((d) => d.id === dealId);

  if (!deal) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted-foreground">This deal has expired.</p>
        <Link to="/deals" className="font-semibold text-primary">
          Browse deals
        </Link>
      </div>
    );
  }

  const saved = savedDeals.includes(deal.id);
  const similar = deals.filter((d) => d.category === deal.category && d.id !== deal.id).slice(0, 3);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32 screen-in">
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-elevated px-5 pb-8 pt-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <Link
            to="/deals"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <button
            onClick={() => toast("Deal link copied")}
            aria-label="Share this deal"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="relative mt-6 flex items-center gap-4">
          <StoreAvatar name={deal.merchant} size="lg" />
          <div>
            <h1 className="text-2xl font-bold">{deal.merchant}</h1>
            <p className="text-sm text-muted-foreground">
              {deal.category} · {deal.distance} away
            </p>
          </div>
        </div>
      </div>

      <section className="px-5 pt-8">
        <h2 className="text-2xl font-bold leading-snug">{deal.title}</h2>
        <p className="mt-3 text-muted-foreground">{deal.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
          <Clock className="h-4 w-4" /> {deal.expires}
        </div>
      </section>

      <section className="surface-card mx-5 mt-6 rounded-3xl p-5">
        <h3 className="text-sm font-semibold text-muted-foreground">CONDITIONS</h3>
        <p className="mt-2 text-sm">{deal.conditions}</p>
        <h3 className="mt-5 text-sm font-semibold text-muted-foreground">HOW TO REDEEM</h3>
        <p className="mt-2 text-sm">{deal.redeem}</p>
      </section>

      <section className="mx-5 mt-6">
        <div className="relative h-44 overflow-hidden rounded-3xl border border-border bg-elevated">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <span className="money-fill glow absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
            <MapPin className="h-5 w-5" />
          </span>
          <button
            onClick={() => toast("Opening directions…")}
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-card/90 px-3 py-2 text-xs font-semibold backdrop-blur"
          >
            <Navigation className="h-3.5 w-3.5" /> Directions
          </button>
        </div>
      </section>

      <section className="mt-10 px-5">
        <h3 className="text-lg font-semibold">Similar deals nearby</h3>
        <div className="mt-4 space-y-3">
          {similar.map((d) => (
            <Link
              key={d.id}
              to="/deals/$dealId"
              params={{ dealId: d.id }}
              className="surface-card flex items-center gap-3 rounded-3xl p-4"
            >
              <StoreAvatar name={d.merchant} size="sm" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{d.title}</div>
                <div className="text-xs text-muted-foreground">
                  {d.merchant} · {d.distance}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-8">
        <button
          onClick={() => toggleDeal(deal.id)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-transform active:scale-[0.98]",
            saved ? "bg-primary/15 text-primary" : "money-fill glow",
          )}
        >
          {saved ? (
            <>
              <Check className="h-5 w-5" /> Saved — Use Deal
            </>
          ) : (
            <>
              <Bookmark className="h-5 w-5" /> Save Deal
            </>
          )}
        </button>
      </div>
    </div>
  );
}
