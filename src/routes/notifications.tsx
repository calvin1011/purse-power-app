import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowLeft,
  BarChart3,
  BellOff,
  Clock,
  Flame,
  MapPin,
  Users,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useApp } from "@/lib/app-state";
import { notifications } from "@/lib/mock-data";
import type { Notification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Sift" },
      {
        name: "description",
        content: "Deals near you, streak reminders, expiring offers and weekly savings reports.",
      },
      { property: "og:title", content: "Notifications · Sift" },
      {
        property: "og:description",
        content: "Everything Sift noticed for you, grouped by today, this week and earlier.",
      },
    ],
  }),
  component: NotificationsScreen,
});

const groups = ["Today", "This Week", "Earlier"] as const;

const icons = {
  deal: MapPin,
  streak: Flame,
  expiring: Clock,
  referral: Users,
  report: BarChart3,
} as const;

function NotificationsScreen() {
  const { readNotifs, markAllNotifsRead, markNotifRead } = useApp();
  const list = notifications;
  const unread = useMemo(
    () => list.filter((n) => !readNotifs.includes(n.id)).length,
    [list, readNotifs],
  );

  return (
    <MobileShell>
      <header className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-semibold">Notifications</span>
          {unread > 0 && (
            <button
              onClick={() => {
                markAllNotifsRead(list.map((n) => n.id));
                toast.success("All caught up");
              }}
              className="ml-auto text-sm font-semibold text-primary"
            >
              Mark all as read
            </button>
          )}
        </div>
        <h1 className="mt-6 text-3xl font-bold">Your updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {unread > 0 ? `${unread} unread` : "Nothing new right now"}
        </p>
      </header>

      {list.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map((g) => {
            const items = list.filter((n) => n.group === g);
            if (items.length === 0) return null;
            return (
              <section key={g}>
                <h2 className="px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {g}
                </h2>
                <div className="mt-3 space-y-3 px-5">
                  {items.map((n) => (
                    <Row
                      key={n.id}
                      n={n}
                      unread={!readNotifs.includes(n.id)}
                      onOpen={() => markNotifRead(n.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </MobileShell>
  );
}

function Row({
  n,
  unread,
  onOpen,
}: {
  n: Notification;
  unread: boolean;
  onOpen: () => void;
}) {
  const Icon = icons[n.kind];
  const body = (
    <>
      <div
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          unread ? "money-fill" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="flex-1 font-semibold leading-snug">{n.title}</p>
          {unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{n.detail}</p>
        <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
      </div>
    </>
  );

  const cls = "surface-card flex gap-3 rounded-3xl p-4 transition-transform active:scale-[0.99]";

  if (n.kind === "deal" || n.kind === "expiring") {
    return (
      <Link
        to="/deals/$dealId"
        params={{ dealId: n.dealId ?? "d1" }}
        onClick={onOpen}
        className={cls}
      >
        {body}
      </Link>
    );
  }
  if (n.kind === "streak") {
    return (
      <Link to="/streak" onClick={onOpen} className={cls}>
        {body}
      </Link>
    );
  }
  if (n.kind === "referral") {
    return (
      <Link to="/referrals" onClick={onOpen} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <Link to="/reports/weekly" onClick={onOpen} className={cls}>
      {body}
    </Link>
  );
}

function EmptyNotifications() {
  return (
    <div className="px-5 pt-16 text-center">
      <div className="surface-card mx-auto flex h-24 w-24 items-center justify-center rounded-4xl">
        <BellOff className="h-10 w-10 text-primary" />
      </div>
      <p className="mt-6 text-lg font-semibold">You're all caught up!</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Keep scanning to unlock deals and we'll ping you the moment one lands nearby.
      </p>
      <Link
        to="/scan"
        className="money-fill glow mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold"
      >
        Scan Receipt
      </Link>
    </div>
  );
}
