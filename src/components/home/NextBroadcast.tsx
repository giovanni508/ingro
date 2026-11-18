"use client";

import { useSyncExternalStore } from "react";
import { nextBroadcast } from "@/lib/schedule";

const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};
const minuteKey = () => Math.floor(Date.now() / 60_000);

/**
 * "Prossima messa in onda". Rendered only when features.nextBroadcast is true
 * (off until the client confirms that the TV times are start times).
 */
export function NextBroadcast() {
  const key = useSyncExternalStore(subscribe, minuteKey, () => 0);
  if (key === 0) return null;
  const n = nextBroadcast(new Date(key * 60_000));
  if (!n) return null;
  const when = n.inDays === 0 ? "oggi" : n.inDays === 1 ? "domani" : n.dayLong.toLowerCase();
  return (
    <p className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--line-dark)] px-5 py-2.5 text-ivory" aria-live="polite">
      <span className="size-2 rounded-full bg-magenta-glow" aria-hidden="true" />
      Prossimo appuntamento in TV su TVM CH19: {when} alle {n.time}
    </p>
  );
}
