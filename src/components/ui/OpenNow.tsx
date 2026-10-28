"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};
const minuteKey = () => Math.floor(Date.now() / 60_000);

function romeParts(d: Date) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")), day: Number(g("day")), month: Number(g("month")), min: Number(g("hour")) * 60 + Number(g("minute")) };
}
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** "Aperto ora / Chiuso ora", from the published hours (Europe/Rome). Off by default (features.openNow). */
export function OpenNow() {
  const key = useSyncExternalStore(subscribe, minuteKey, () => 0);
  if (key === 0) return null;
  const { dow, day, month, min } = romeParts(new Date(key * 60_000));
  const h = site.openingHours;
  let slots: string[][] = [];
  if (dow >= 1 && dow <= 6) slots = h.weekdays.slots;
  else if (dow === 0 && day <= 7 && month !== 8 && month !== 9) slots = h.sunday.slots;
  const open = slots.some(([a, b]) => min >= toMin(a) && min < toMin(b));
  return (
    <span className="inline-flex items-center gap-2 text-sm" role="status">
      <span className={`size-2 rounded-full ${open ? "bg-[#4ade80]" : "bg-ivory-dim"}`} aria-hidden="true" />
      {open ? "Aperto ora" : "Chiuso ora"}
    </span>
  );
}
