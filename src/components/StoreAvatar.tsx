import { brandColors, initials } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function StoreAvatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "lg" ? "h-16 w-16 text-lg" : size === "sm" ? "h-9 w-9 text-[11px]" : "h-12 w-12 text-sm";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl font-semibold text-foreground",
        dims,
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${brandColors[name] ?? "oklch(0.6 0.1 175)"} 35%, transparent)`,
        border: `1px solid color-mix(in oklab, ${brandColors[name] ?? "oklch(0.6 0.1 175)"} 55%, transparent)`,
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
