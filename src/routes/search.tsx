import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, ReceiptText, Search, Store, Tag, TrendingUp, X } from "lucide-react";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { deals, money, popularSearches, recentSearches } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search · Sift" },
      {
        name: "description",
        content: "Search deals, stores and every receipt item you've ever scanned.",
      },
      { property: "og:title", content: "Search · Sift" },
      {
        property: "og:description",
        content: "One search across nearby deals, your stores and your receipt vault.",
      },
    ],
  }),
  component: SearchScreen,
});

function SearchScreen() {
  const { receipts } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { deals: [], stores: [] as string[], receipts: [] };
    const d = deals.filter(
      (x) =>
        x.title.toLowerCase().includes(term) ||
        x.merchant.toLowerCase().includes(term) ||
        x.category.toLowerCase().includes(term),
    );
    const stores = Array.from(new Set(receipts.map((r) => r.store))).filter((s) =>
      s.toLowerCase().includes(term),
    );
    const rec = receipts.filter(
      (r) =>
        r.store.toLowerCase().includes(term) ||
        r.items.some((i) => i.name.toLowerCase().includes(term)),
    );
    return { deals: d, stores, receipts: rec };
  }, [term, receipts]);

  const empty =
    term.length > 0 &&
    results.deals.length === 0 &&
    results.stores.length === 0 &&
    results.receipts.length === 0;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-16 screen-in">
      <header className="sticky top-0 z-20 bg-background px-5 pb-4 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <Search className="h-4.5 w-4.5 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search deals, stores, items"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search">
                <X className="h-4.5 w-4.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate({ to: "/home" })}
            className="text-sm font-semibold text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </header>

      {!term && (
        <div className="px-5 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent searches
          </h2>
          <div className="mt-3 space-y-1">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left text-sm"
              >
                <Clock className="h-4.5 w-4.5 text-muted-foreground" />
                {s}
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Popular searches
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularSearches.map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                <TrendingUp className="h-4 w-4 text-primary" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {term && !empty && (
        <div className="space-y-8 px-5 pt-2">
          {results.deals.length > 0 && (
            <section>
              <GroupTitle>Deals</GroupTitle>
              <div className="mt-3 space-y-2">
                {results.deals.map((d) => (
                  <Link
                    key={d.id}
                    to="/deals/$dealId"
                    params={{ dealId: d.id }}
                    className="surface-card flex items-center gap-3 rounded-2xl p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Tag className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.merchant} · {d.distance}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.stores.length > 0 && (
            <section>
              <GroupTitle>Stores</GroupTitle>
              <div className="mt-3 space-y-2">
                {results.stores.map((s) => (
                  <Link
                    key={s}
                    to="/receipts"
                    className="surface-card flex items-center gap-3 rounded-2xl p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Store className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{s}</p>
                      <p className="text-xs text-muted-foreground">See receipts from this store</p>
                    </div>
                    <StoreAvatar name={s} size="sm" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.receipts.length > 0 && (
            <section>
              <GroupTitle>Receipts</GroupTitle>
              <div className="mt-3 space-y-2">
                {results.receipts.map((r) => (
                  <Link
                    key={r.id}
                    to="/receipts/$receiptId"
                    params={{ receiptId: r.id }}
                    className="surface-card flex items-center gap-3 rounded-2xl p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <ReceiptText className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{r.store}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {r.items.length} items
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{money(r.total)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {empty && (
        <div className="px-5 pt-16 text-center">
          <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-6 text-lg font-semibold">No results for "{q.trim()}"</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or browse what's nearby.
          </p>
          <Link
            to="/deals"
            className="money-fill mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold"
          >
            Browse deals
          </Link>
        </div>
      )}
    </div>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}
