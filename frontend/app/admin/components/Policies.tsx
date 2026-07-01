"use client";

import { ScrollText } from "lucide-react";
import PlaceholderPanel from "./PlaceholderPanel";

export default function Policies() {
  return (
    <PlaceholderPanel
      icon={<ScrollText size={30} />}
      title="Policies"
      description="Set check-in/out times, cancellation and house rules. This module is coming soon."
    />
  );
}
