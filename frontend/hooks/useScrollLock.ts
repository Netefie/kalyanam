"use client";

import { useEffect } from "react";

// Reference-counted body scroll lock.
//
// Several overlays can be mounted at once (mobile sidebar, offer popup, photo
// lightbox). Each writing `document.body.style.overflow` directly meant the
// last one to run won, and every one of them "restored" to a hardcoded "auto"
// rather than whatever was there before — so closing one overlay unlocked the
// page while another was still open. Counting locks here fixes both: the body
// only unlocks when the *last* holder releases, and it restores the real
// previous value.
let lockCount = 0;
let previousOverflow = "";

export default function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [active]);
}
