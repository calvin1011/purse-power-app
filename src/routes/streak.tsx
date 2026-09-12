import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Flame, Lock } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { STREAK_DAYS, badges, scanDays } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/streak")({
  head: () => ({
    meta: [
      { title: "Your streak & badges · Sift" },
      {
        name: "description",
        content: "Your scanning streak calendar, earned badges and the next milestone ahead.",
      },
      { property: "og:title", content: "Your streak & badges · Sift" },
      {
        property: "og:description",
        content: "Keep the streak alive and unlock badges as you scan and save.",
      },
    ],
  }),
  component: StreakScreen,
});

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

function StreakScreen() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

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
          <span className="font-semibold">Streak</span>
        </div>
      </header>

      <section className="px-5 pt-8 text-center">
        <div className="money-fill glow flame-pulse mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
          <Flame className="h-11 w-11" strokeWidth={2.2} />
        </div>
        <div className="money-text mt-6 text-6xl font-bold tracking-tight">{STREAK_DAYS}</div>
        <p className="mt-2 text-sm text-muted-foreground">day scanning streak</p>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">{monthName}</h2>
        <div className="surface-card mt-4 rounded-3xl p-5">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted-foreground">
            {dayLabels.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const scanned = scanDays.includes(day);
              return (
                <span
                  key={day}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl text-xs font-medium",
                    scanned ? "money-fill" : "bg-muted text-muted-foreground",
                  )}
                >
                  {day}
                </span>
              );
            })}
          </div>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            Highlighted days are days you scanned a receipt.
          </p>
        </div>
      </section>

      <section className="px-5 pt-10">
        <h2 className="text-lg font-semibold">Badges</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={cn("surface-card rounded-3xl p-4", !b.done && "opacity-60")}
            >
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl",
                  b.done ? "money-fill" : "bg-muted text-muted-foreground",
                )}
              >
                {b.done ? <Award className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <p className="mt-3 text-sm font-semibold leading-snug">{b.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {b.done ? b.detail : b.progress}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pt-8">
        <div className="rounded-3xl border border-primary/40 bg-primary/10 p-5">
          <p className="font-semibold text-primary">You're 2 scans away from your next badge!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            One more deal used unlocks Deal Hunter too.
          </p>
          <Link
            to="/scan"
            className="money-fill glow mt-4 flex w-full items-center justify-center rounded-2xl py-3.5 font-semibold"
          >
            Scan Receipt
          </Link>
        </div>
      </section>
    </MobileShell>
  );
}
