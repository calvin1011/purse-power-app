import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Apple, Chrome, Mail } from "lucide-react";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/onboarding/account")({
  head: () => ({
    meta: [
      { title: "Create your Sift account" },
      {
        name: "description",
        content: "Save your receipts and savings across devices — or skip and start scanning now.",
      },
      { property: "og:title", content: "Create your Sift account" },
      {
        property: "og:description",
        content: "Sign up with email, Google or Apple. No account required to start scanning.",
      },
    ],
  }),
  component: AccountScreen,
});

function AccountScreen() {
  const { setAccount, completeOnboarding } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const finish = (name?: string, mail?: string) => {
    if (name && mail) setAccount(name, mail);
    completeOnboarding();
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10 pt-20 screen-in">
      <h1 className="text-3xl font-bold leading-tight">Keep your savings safe</h1>
      <p className="mt-3 text-muted-foreground">
        An account syncs your receipts and deals across devices. Totally optional.
      </p>

      <form
        className="mt-10 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          finish(email.split("@")[0] || "Friend", email);
        }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          className="money-fill glow w-full rounded-2xl py-4 text-base font-semibold transition-transform active:scale-[0.98]"
        >
          Continue with email
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => finish("Calvin", "calvin@gmail.com")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-4 text-base font-medium transition-colors active:bg-elevated"
        >
          <Chrome className="h-5 w-5" /> Continue with Google
        </button>
        <button
          onClick={() => finish("Calvin", "calvin@icloud.com")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-4 text-base font-medium transition-colors active:bg-elevated"
        >
          <Apple className="h-5 w-5" /> Continue with Apple
        </button>
      </div>

      <div className="flex-1" />
      <button
        onClick={() => finish()}
        className="mt-10 w-full rounded-2xl py-4 text-base font-semibold text-primary"
      >
        Skip for now — start scanning
      </button>
    </div>
  );
}
