"use client";

import { Building2 } from "lucide-react";
import PlaceholderPanel from "./PlaceholderPanel";

export default function PhysicalRooms() {
  return (
    <PlaceholderPanel
      icon={<Building2 size={30} />}
      title="Physical Rooms"
      description="Manage individual room units (room numbers, floors and their live status). This module is coming soon."
    />
  );
}
