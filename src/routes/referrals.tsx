import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Copy,
  Gift,
  Instagram,
  Link2,
  MessageCircle,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import {
  REFERRAL_CODE,
  REFERRER_PERCENTILE,
  friends,
  initials,
  referralMilestones,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Invite friends · Sift" },
      {
        name: "description",
        content: "Give $5, get $5. Share your Sift code and unlock referral milestones.",
      },
      { property: "og:title", content: "Invite friends · Sift" },
      {
        property: "og:description",
        content: "Share your code, track friends who joined and unlock premium rewards.",
      },
    ],
  }),
  component: Referrals,
});

const shares = [
  { label: "Text message", icon: MessageSquare },
  { label: "WhatsApp", icon: MessageCircle },
  { label: "Instagram story", icon: Instagram },
  { label: "Copy link", icon: Link2 },
] as const;

function Referrals() {
  return (
    <MobileShell>
      <header className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-semibold">Invite friends</span>
        </div>
      </header>

      <section className="mx-5 mt-8 overflow-hidden rounded-4xl border border-primary/40 bg-primary/10 p-6 text-center">
        <div className="money-fill glow mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
          <Gift className="h-8 w-8" />
        </div>
        <h1 className="money-text mt-5 text-4xl font-bold tracking-tight">Give $5, Get $5</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your friend gets $5 after their first scan. You get $5 the moment they do.
        </p>
      </section>

      <section className="px-5 pt-8">
        <h2 className="text-lg font-semibold">Your code</h2>
        <button
          onClick={() => toast.success("Referral code copied")}
          className="mt-4 flex w-full items-center justify-between rounded-3xl border border-dashed border-primary/50 bg-primary/10 px-5 py-5"
        >
          <span className="font-mono text-xl font-bold text-primary">{REFERRAL_CODE}</span>
          <Copy className="h-5 w-5 text-primary" />
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {shares.map((s) => (
            <button
              key={s.label}
              onClick={() => toast(`Shared via ${s.label}`)}
              className="surface-card flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition-transform active:scale-[0.98]"
            >
              <s.icon className="h-5 w-5 text-primary" />
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">{friends.length} friends joined</h2>
        <div className="surface-card mt-4 divide-y divide-border rounded-3xl">
          {friends.map((f) => (
            <div key={f.id} className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-sm font-semibold">
                {initials(f.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.joined}</p>
              </div>
              <span className="money-text text-sm font-bold">+$5</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">Milestone rewards</h2>
        <div className="mt-4 space-y-3">
          {referralMilestones.map((m) => {
            const pct = Math.round((m.have / m.need) * 100);
            return (
              <div key={m.id} className="surface-card rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{m.label}</p>
                  <span className="text-xs text-muted-foreground">
                    {m.have}/{m.need}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{m.reward}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="money-fill h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-10">
        <div className={cn("surface-card flex items-center gap-4 rounded-3xl p-5")}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">You're in the top {REFERRER_PERCENTILE}% of referrers</p>
            <p className="text-sm text-muted-foreground">
              Two more invites moves you into the top 10%
            </p>
          </div>
        </div>
      </section>

      <div className="px-5 pt-8">
        <Link
          to="/scan"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 font-semibold"
        >
          <Camera className="h-5 w-5" /> Keep scanning
        </Link>
      </div>
    </MobileShell>
  );
}
