import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, ReceiptText, User, Camera } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/deals", label: "Deals", icon: Compass },
  { to: "/receipts", label: "Receipts", icon: ReceiptText },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MobileShell({
  children,
  hideTabs = false,
}: {
  children: ReactNode;
  hideTabs?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <main className={cn("flex-1 screen-in", hideTabs ? "pb-0" : "pb-32")}>{children}</main>
      {!hideTabs && (
        <nav className="fixed inset-x-0 bottom-0 z-40">
          <div className="mx-auto max-w-md px-4 pb-4">
            <div className="relative flex items-end justify-between rounded-3xl border border-border bg-card/95 px-3 py-2 backdrop-blur-xl">
              {tabs.slice(0, 2).map((t) => (
                <TabItem key={t.to} {...t} active={pathname.startsWith(t.to)} />
              ))}
              <Link
                to="/scan"
                aria-label="Scan receipt"
                className="money-fill glow -mt-8 flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
              >
                <Camera className="h-7 w-7" strokeWidth={2.2} />
              </Link>
              {tabs.slice(2).map((t) => (
                <TabItem key={t.to} {...t} active={pathname.startsWith(t.to)} />
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

function TabItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex w-16 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
      {label}
    </Link>
  );
}
