"use client";

import { IndianRupee } from "lucide-react";
import PlaceholderPanel from "./PlaceholderPanel";

export default function Pricing() {
  return (
    <PlaceholderPanel
      icon={<IndianRupee size={30} />}
      title="Pricing"
      description="Configure seasonal rates, weekend pricing and special offers. For now, per-night prices are managed per room in the Rooms section."
    />
  );
}
