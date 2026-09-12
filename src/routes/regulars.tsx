import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, Info, Plus, ReceiptText, X } from "lucide-react";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-state";
import { money, regularItems, suggestedRegulars } from "@/lib/mock-data";
import type { RegularCategory, RegularItem } from "@/lib/mock-data";

export const Route = createFileRoute("/regulars")({
  head: () => ({
    meta: [
      { title: "Your regulars · Sift" },
      { name: "description", content: "Review the items Sift tracks from your receipts to find relevant deals." },
      { property: "og:title", content: "Your regulars · Sift" },
      { property: "og:description", content: "Your automatically updated list of frequently purchased items." },
    ],
  }),
  component: RegularsScreen,
});

const categories: RegularCategory[] = ["Grocery", "Household", "Dining", "Personal Care"];

function RegularsScreen() {
  const {
    pausedRegulars,
    addedRegulars,
    manualRegulars,
    dismissedSuggestions,
    regularsIntroSeen,
    toggleRegular,
    addRegular,
    addManualRegular,
    dismissRegularSuggestion,
    dismissRegularsIntro,
  } = useApp();
  const [addingTo, setAddingTo] = useState<RegularCategory | null>(null);
  const [itemName, setItemName] = useState("");
  const visibleSuggestions = suggestedRegulars.filter(
    (item) => !addedRegulars.includes(item.id) && !dismissedSuggestions.includes(item.id),
  );

  return (
    <MobileShell>
      <header className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <Link to="/home" aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-semibold">My Regulars</span>
        </div>
        <h1 className="mt-6 text-3xl font-bold">Your Regulars</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Items we track deals on for you. Updated automatically from your receipts.
        </p>
      </header>

      {!regularsIntroSeen && (
        <section className="mx-5 mt-6 flex gap-3 rounded-3xl border border-primary/30 bg-primary/10 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">
              We build this list from your receipts automatically. The more you scan, the smarter your deals get.
            </p>
          </div>
          <button onClick={dismissRegularsIntro} aria-label="Dismiss" className="h-7 w-7 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </section>
      )}

      <div className="mt-8 space-y-9">
        {categories.map((category) => {
          const items = [
            ...regularItems.filter((item) => item.category === category),
            ...suggestedRegulars.filter((item) => item.category === category && addedRegulars.includes(item.id)),
            ...manualRegulars.filter((item) => item.category === category),
          ];
          return (
            <section key={category}>
              <h2 className="px-5 text-lg font-semibold">{category}</h2>
              <div className="mx-5 mt-3 divide-y divide-border rounded-3xl surface-card">
                {items.map((item) => (
                  <RegularRow key={item.id} item={item} paused={pausedRegulars.includes(item.id)} onToggle={() => toggleRegular(item.id)} />
                ))}
                {addingTo === category ? (
                  <form
                    className="flex items-center gap-2 p-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (!itemName.trim()) return;
                      addManualRegular(itemName.trim(), category);
                      toast.success(`${itemName.trim()} added to your regulars`);
                      setItemName("");
                      setAddingTo(null);
                    }}
                  >
                    <input
                      autoFocus
                      value={itemName}
                      onChange={(event) => setItemName(event.target.value)}
                      placeholder="Item name"
                      className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button type="submit" aria-label="Add item" className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Check className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setAddingTo(category)} className="flex w-full items-center gap-2 px-4 py-3.5 text-sm font-semibold text-primary">
                    <Plus className="h-4 w-4" /> Add item
                  </button>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {visibleSuggestions.length > 0 && (
        <section className="px-5 pt-10">
          <h2 className="text-lg font-semibold">Suggested additions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Recently noticed in your receipts</p>
          <div className="mt-4 space-y-3">
            {visibleSuggestions.map((item) => (
              <div key={item.id} className="surface-card rounded-3xl p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <ReceiptText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.brand} · {item.frequency}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => addRegular(item.id)} className="flex-1 rounded-2xl bg-primary/15 py-2.5 text-sm font-semibold text-primary">Add</button>
                  <button onClick={() => dismissRegularSuggestion(item.id)} className="flex-1 rounded-2xl border border-border py-2.5 text-sm font-semibold text-muted-foreground">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link to="/deals" className="mx-5 mt-10 flex items-center justify-between rounded-3xl border border-primary/30 bg-primary/10 p-5">
        <div>
          <p className="font-semibold">See deals on your regulars</p>
          <p className="mt-1 text-xs text-muted-foreground">Only recommendations tied to what you buy</p>
        </div>
        <ChevronRight className="h-5 w-5 text-primary" />
      </Link>
    </MobileShell>
  );
}

function RegularRow({ item, paused, onToggle }: { item: RegularItem; paused: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{item.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{item.brand ? `${item.brand} · ` : ""}{item.averagePrice > 0 ? `Avg. ${money(item.averagePrice)}` : "Price learned from your next receipt"}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.frequency}</p>
      </div>
      <Switch checked={!paused} onCheckedChange={onToggle} aria-label={`Track ${item.name}`} />
    </div>
  );
}