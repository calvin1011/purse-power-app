import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Award,
  Bell,
  ChevronRight,
  Copy,
  Flame,
  Lock,
  MapPin,
  Moon,
  Target,
  Users,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-state";
import { REFERRAL_CODE, STREAK_DAYS, achievements, money } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Sift" },
      {
        name: "description",
        content: "Your savings stats, streaks, milestones, referrals and app settings.",
      },
      { property: "og:title", content: "Your profile — Sift" },
      {
        property: "og:description",
        content: "Track lifetime savings, hit milestones, and invite friends to Sift.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { name, email, totalSaved, receiptCount, dealsUsed, theme, toggleTheme, goal, setGoal, locationOn, setLocationOn } =
    useApp();
  const [notif, setNotif] = useState(true);
  const [privacy, setPrivacy] = useState(false);

  const monthSaved = 38.9;
  const pct = Math.min(100, Math.round((monthSaved / goal) * 100));

  return (
    <MobileShell>
      <header className="px-5 pt-10">
        <div className="flex items-center gap-4">
          <div className="money-fill flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-bold">
            {(name ?? "H")[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold">{name ?? "Hey there"}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {email ?? "No account yet"}
            </p>
          </div>
        </div>
        {!name && (
          <Link
            to="/onboarding/account"
            className="money-fill mt-5 flex w-full items-center justify-center rounded-2xl py-3.5 font-semibold"
          >
            Create an account to sync
          </Link>
        )}
      </header>

      <section className="surface-card mx-5 mt-8 rounded-3xl p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Receipts" value={String(receiptCount)} />
          <Stat label="Saved" value={money(totalSaved)} accent />
          <Stat label="Deals used" value={String(dealsUsed)} />
        </div>
        <p className="mt-4 border-t border-border pt-3 text-center text-xs text-muted-foreground">
          Member since June 2026
        </p>
      </section>

      <Link
        to="/streak"
        className="surface-card mx-5 mt-4 flex items-center gap-4 rounded-3xl p-5 transition-transform active:scale-[0.99]"
      >
        <span className="money-fill flame-pulse flex h-12 w-12 items-center justify-center rounded-2xl">
          <Flame className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-semibold">Savings streak</p>
          <p className="text-sm text-muted-foreground">
            {STREAK_DAYS} days · see your calendar and badges
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <section className="mt-8 px-5">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Monthly savings goal</h2>
        </div>
        <div className="surface-card mt-4 rounded-3xl p-5">
          <div className="flex items-end justify-between">
            <span className="money-text text-3xl font-bold">{money(monthSaved)}</span>
            <span className="text-sm text-muted-foreground">of {money(goal)}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="money-fill h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 flex gap-2">
            {[40, 60, 100].map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={cn(
                  "flex-1 rounded-2xl border py-2 text-sm font-medium",
                  goal === g
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                ${g}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Streak & milestones</h2>
        </div>
        <Link
          to="/streak"
          className="surface-card mt-4 flex items-center gap-4 rounded-3xl p-5 transition-transform active:scale-[0.99]"
        >
          <span className="money-text text-4xl font-bold">{STREAK_DAYS}</span>
          <div className="flex-1">
            <p className="font-semibold">day scanning streak</p>
            <p className="text-sm text-muted-foreground">Scan today to keep it alive</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div className="mt-3 space-y-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={cn(
                "surface-card flex items-center gap-3 rounded-2xl p-4",
                !a.done && "opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  a.done ? "money-fill" : "bg-muted text-muted-foreground",
                )}
              >
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Share with friends</h2>
        </div>
        <div className="mt-4 rounded-3xl border border-primary/40 bg-primary/10 p-5">
          <p className="money-text text-2xl font-bold">Give $5, Get $5</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Friends get $5 after their first scan. So do you.
          </p>
          <button
            onClick={() => toast.success("Referral code copied")}
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-dashed border-primary/50 bg-primary/10 px-4 py-3"
          >
            <span className="font-mono text-base font-semibold text-primary">{REFERRAL_CODE}</span>
            <Copy className="h-4 w-4 text-primary" />
          </button>
          <Link
            to="/referrals"
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-2xl bg-primary/15 py-3 text-sm font-semibold text-primary"
          >
            Invite friends & track rewards <ChevronRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">3 friends joined so far</p>
        </div>
      </section>

      <section className="mt-8 px-5">
        <h2 className="text-lg font-semibold">Settings</h2>
        <div className="surface-card mt-4 divide-y divide-border rounded-3xl">
          <Row icon={Bell} label="Notifications" checked={notif} onChange={setNotif} />
          <Row icon={MapPin} label="Location access" checked={locationOn} onChange={setLocationOn} />
          <Row
            icon={Moon}
            label="Dark mode"
            checked={theme === "dark"}
            onChange={() => toggleTheme()}
          />
          <Row icon={Lock} label="Private receipt data" checked={privacy} onChange={setPrivacy} />
        </div>
      </section>
    </MobileShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className={cn("text-xl font-bold", accent && "money-text")}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
