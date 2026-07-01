"use client";

import { Sparkles } from "lucide-react";
import PlaceholderPanel from "./PlaceholderPanel";

export default function Amenities() {
  return (
    <PlaceholderPanel
      icon={<Sparkles size={30} />}
      title="Amenities"
      description="Curate the amenities offered across room types (Wi-Fi, breakfast, spa access and more). This module is coming soon."
    />
  );
}
