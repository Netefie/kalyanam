"use client";

import { CalendarDays } from "lucide-react";
import PlaceholderPanel from "./PlaceholderPanel";

export default function Availability() {
  return (
    <PlaceholderPanel
      icon={<CalendarDays size={30} />}
      title="Availability"
      description="View and block room availability across a calendar. This module is coming soon."
    />
  );
}
