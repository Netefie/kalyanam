"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useScrollLock from "@/hooks/useScrollLock";

interface Props {
  images: string[];
  title: string;
  initialIndex?: number;
  onClose: () => void;
}

// Generic full-screen image viewer. Deliberately knows nothing about rooms so
// any gallery on the site can reuse it — callers just hand it a list of image
// paths and an onClose.
export default function Lightbox({
  images,
  title,
  initialIndex = 0,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  const count = images.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  // This component only renders while the gallery is open, so the lock is
  // held for its whole lifetime.
  useScrollLock(true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  if (count === 0) return null;

  // Rendered through a portal: the room card applies a transform on hover,
  // which would otherwise become the containing block for this `fixed`
  // overlay and trap it inside the card instead of covering the viewport.
  // Safe to reach for `document` here — this component is only ever mounted
  // from a click handler, never during SSR.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25"
      >
        <X size={22} />
      </button>

      {/* Stop clicks inside the frame from closing via the backdrop handler. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-zoom-in relative w-full max-w-5xl"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/40">
          <Image
            src={images[index]}
            alt={`${title} — photo ${index + 1} of ${count}`}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain"
          />
        </div>

        {count > 1 && (
          <>
            <NavButton side="left" onClick={() => go(-1)} />
            <NavButton side="right" onClick={() => go(1)} />

            <div className="mt-5 flex items-center justify-center gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-[#B68D40]" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white transition hover:scale-105 hover:bg-white/30 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon size={24} />
    </button>
  );
}
