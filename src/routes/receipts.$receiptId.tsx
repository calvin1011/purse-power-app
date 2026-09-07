import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Share2, Sparkles, Tag } from "lucide-react";
import { StoreAvatar } from "@/components/StoreAvatar";
import { useApp } from "@/lib/app-state";
import { money } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/receipts/$receiptId")({
  head: () => ({
    meta: [
      { title: "Receipt detail — Sift" },
      {
        name: "description",
        content: "Full itemized receipt with any savings and deals noted inline.",
      },
      { property: "og:title", content: "Receipt detail — Sift" },
      {
        property: "og:description",
        content: "Every line item, plus what you could have saved on this trip.",
      },
    ],
  }),
  component: ReceiptDetail,
});

function ReceiptDetail() {
  const { receiptId } = useParams({ from: "/receipts/$receiptId" });
  const { receipts } = useApp();
  const r = receipts.find((x) => x.id === receiptId);

  if (!r) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted-foreground">That receipt isn't in your vault.</p>
        <Link to="/receipts" className="font-semibold text-primary">
          Back to receipts
        </Link>
      </div>
    );
  }

  const found = r.savings.reduce((a, s) => a + s.amount, 0);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-16 screen-in">
      <div className="flex items-center gap-3 px-5 pt-8">
        <Link
          to="/receipts"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-semibold">Receipt</span>
        <button
          onClick={() => toast("Receipt link copied")}
          aria-label="Share receipt"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-card"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pt-8 text-center">
        <StoreAvatar name={r.store} size="lg" />
        <h1 className="mt-4 text-2xl font-bold">{r.store}</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(r.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
          })}{" "}
          · {r.category}
        </p>
        <p className="mt-4 text-4xl font-bold">{money(r.total)}</p>
        {found > 0 && (
          <span className="mt-3 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
            {money(found)} in savings found
          </span>
        )}
      </div>

      <section className="surface-card mx-5 mt-8 rounded-3xl p-5">
        <h2 className="text-sm font-semibold text-muted-foreground">ITEMS</h2>
        <div className="mt-4 space-y-3">
          {r.items.map((i) => {
            const linked = r.savings.find((s) =>
              s.title.toLowerCase().includes(i.name.split(" ")[0]!.toLowerCase()),
            );
            return (
              <div key={i.name}>
                <div className="flex justify-between text-sm">
                  <span>
                    {i.qty > 1 && `${i.qty}× `}
                    {i.name}
                  </span>
                  <span className="font-medium">{money(i.price * i.qty)}</span>
                </div>
                {linked && (
                  <p className="mt-1 text-xs text-primary">
                    {money(linked.amount)} cheaper at {linked.store}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex justify-between border-t border-border pt-4 font-semibold">
          <span>Total</span>
          <span>{money(r.total)}</span>
        </div>
      </section>

      {r.savings.length > 0 && (
        <section className="mt-8 px-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Savings on this trip</h2>
          </div>
          <div className="mt-4 space-y-3">
            {r.savings.map((s) => (
              <div key={s.id} className="surface-card flex gap-3 rounded-3xl p-4">
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
                </div>
                <span className="money-text font-bold">{money(s.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
