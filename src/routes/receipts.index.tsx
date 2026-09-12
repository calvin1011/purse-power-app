import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ReceiptText, Search } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { money } from "@/lib/mock-data";
import type { Category } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/receipts/")({
  head: () => ({
    meta: [
      { title: "Receipt vault — Sift" },
      {
        name: "description",
        content: "Every receipt you've scanned, searchable by store, date and category.",
      },
      { property: "og:title", content: "Receipt vault — Sift" },
      {
        property: "og:description",
        content: "Search and filter all of your itemized receipts in one place.",
      },
    ],
  }),
  component: Vault,
});

const cats: (Category | "All")[] = ["All", "Grocery", "Dining", "Retail", "Services"];
const ranges = ["Any time", "This week", "This month"] as const;

function Vault() {
  const { receipts } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [range, setRange] = useState<(typeof ranges)[number]>("Any time");

  const list = useMemo(() => {
    const now = Date.now();
    return receipts
      .filter((r) => (cat === "All" ? true : r.category === cat))
      .filter((r) =>
        q
          ? r.store.toLowerCase().includes(q.toLowerCase()) ||
            r.items.some((i) => i.name.toLowerCase().includes(q.toLowerCase()))
          : true,
      )
      .filter((r) => {
        const days = (now - new Date(r.date).getTime()) / 86400000;
        if (range === "This week") return days <= 7;
        if (range === "This month") return days <= 31;
        return true;
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [receipts, q, cat, range]);

  if (receipts.length === 0) {
    return (
      <MobileShell>
        <header className="px-5 pt-10">
          <h1 className="text-3xl font-bold">Receipts</h1>
        </header>
        <div className="px-5 pt-16 text-center">
          <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
            <ReceiptText className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-6 text-lg font-semibold">Scan your first receipt to start saving</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We'll pull out every item and show you exactly where you could have paid less.
          </p>
          <Link
            to="/scan"
            className="money-fill glow mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold"
          >
            Scan Receipt
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <header className="px-5 pt-10">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold">Receipts</h1>
          <Link
            to="/search"
            aria-label="Search everything"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {receipts.length} saved · every item searchable
        </p>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stores or items"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </header>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </div>
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-5">
        {ranges.map((r) => (
          <Chip key={r} active={range === r} onClick={() => setRange(r)}>
            {r}
          </Chip>
        ))}
      </div>

      <div className="mt-5 space-y-3 px-5">
        {list.map((r) => {
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
                <div className="flex justify-between gap-2">
                  <span className="truncate font-semibold">{r.store}</span>
                  <span className="font-semibold">{money(r.total)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    {new Date(r.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {r.items.length} items · {r.category}
                  </span>
                  {found > 0 && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
                      +{money(found)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
        {list.length === 0 && (
          <p className="py-14 text-center text-sm text-muted-foreground">
            No receipts match those filters.
          </p>
        )}
      </div>
    </MobileShell>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
