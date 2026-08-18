"use client";

import { Check } from "lucide-react";

// Generic amenities that don't vary by rate plan. Breakfast inclusion and
// cancellation terms differ per plan and are rendered in RatePlanRow instead.
const AMENITIES = ["Free WiFi", "Air Conditioning", "Room Service", "Smart TV"];

export default function AmenityList() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {AMENITIES.map((text) => (
        <div key={text} className="flex items-center gap-2">
          <Check size={16} className="text-green-600" />
          <span className="text-sm text-gray-700">{text}</span>
        </div>
      ))}
    </div>
  );
}
