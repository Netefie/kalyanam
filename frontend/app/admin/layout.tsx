import type { Metadata } from "next";

import AdminShell from "./AdminShell";

// Server component purely so it can export `metadata`. The interactive shell —
// route guard, sidebar, topbar — is AdminShell.tsx.
//
// The panel is already token-guarded, but it should never surface in a search
// result either: `noindex` here covers admin URLs that leaked into a link
// somewhere, and app/robots.ts adds the matching Disallow.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
