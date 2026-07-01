"use client";

import { Images } from "lucide-react";
import PlaceholderPanel from "./PlaceholderPanel";

export default function Gallery() {
  return (
    <PlaceholderPanel
      icon={<Images size={30} />}
      title="Gallery"
      description="Upload and organise room and property photos. This module is coming soon."
    />
  );
}
