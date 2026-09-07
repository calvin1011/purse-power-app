import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, MapPin, Receipt, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/value")({
  head: () => ({
    meta: [
      { title: "How Sift works" },
      {
        name: "description",
        content: "See what you missed, find cheaper nearby, and keep every receipt in one place.",
      },
      { property: "og:title", content: "How Sift works" },
      {
        property: "og:description",
        content: "Four ways Sift puts money back in your pocket after every purchase.",
      },
    ],
  }),
  component: ValueProps,
});

const cards = [
  {
    icon: Search,
    title: "See what you missed",
    body: "Every receipt gets checked against prices and offers you were eligible for.",
  },
  {
    icon: MapPin,
    title: "Find cheaper nearby",
    body: "The same items, priced at stores within a few minutes of you.",
  },
  {
    icon: Receipt,
    title: "All your receipts, one place",
    body: "Searchable, itemized, and organized — no more crumpled paper.",
  },
  {
    icon: Tag,
    title: "Deals that actually match you",
    body: "Offers based on what you already buy, not random coupons.",
  },
];

function ValueProps() {
  const [i, setI] = useState(0);
  const Card = cards[i];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10 pt-14 screen-in">
      <div className="flex justify-end">
        <Link to="/onboarding/account" className="text-sm text-muted-foreground">
          Skip
        </Link>
      </div>

      <div
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setI(Math.round(el.scrollLeft / (el.clientWidth * 0.86)));
        }}
      >
        {cards.map((c) => (
          <div
            key={c.title}
            className="surface-card w-[86%] shrink-0 snap-center rounded-3xl p-7"
          >
            <div className="money-fill flex h-14 w-14 items-center justify-center rounded-2xl">
              <c.icon className="h-7 w-7" />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-snug">{c.title}</h2>
            <p className="mt-3 text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {cards.map((c, idx) => (
          <span
            key={c.title}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted",
            )}
          />
        ))}
      </div>

      <div className="flex-1" />
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Swipe through, then start scanning — {Card?.title.toLowerCase()}.
      </p>
      <Link
        to="/onboarding/account"
        className="money-fill glow flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold transition-transform active:scale-[0.98]"
      >
        Continue <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
