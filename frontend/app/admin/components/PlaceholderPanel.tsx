"use client";

import type { ReactNode } from "react";

interface PlaceholderPanelProps {
  icon: ReactNode;
  title: string;
  description: string;
}

// Lightweight "coming soon" panel used by the accommodation management tabs
// whose full modules aren't built yet.
export default function PlaceholderPanel({
  icon,
  title,
  description,
}: PlaceholderPanelProps) {
  return (
    <div className="placeholder">
      <div className="iconWrap">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>

      <style jsx>{`
        .placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 56px 24px;
        }

        .iconWrap {
          width: 76px;
          height: 76px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f0e5;
          color: #b68d40;
          margin-bottom: 20px;
        }

        h3 {
          margin: 0;
          font-size: 26px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        p {
          margin-top: 10px;
          max-width: 460px;
          color: #888;
          font-size: 15px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
