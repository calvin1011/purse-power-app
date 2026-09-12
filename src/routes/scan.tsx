import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/scan")({
  component: ScanLayout,
});

function ScanLayout() {
  return <Outlet />;
}
