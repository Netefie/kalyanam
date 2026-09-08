"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { SiteSettings } from "@/lib/api";

// The site settings singleton, fetched once on the server in app/layout.tsx
// and handed down so client components don't each have to fetch it (which is
// what /cancellation-policy and BookingSuccess used to do — two requests for
// the same document, both arriving after hydration).
//
// Server components should call getSiteSettings() from lib/settings.ts
// directly instead of reaching for this.
const SettingsContext = createContext<SiteSettings | null>(null);

export default function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SiteSettings {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("useSettings must be used inside SettingsProvider.");
  }

  return settings;
}
