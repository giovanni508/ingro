import { tv } from "./site";


/** Wall-clock parts in Europe/Rome, whatever the visitor's timezone. */
function romeNow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { dow, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Next TV slot after `now` (social lives have no fixed days any more). ONLY used when
 * features.nextBroadcast is true: the schedule format is unconfirmed (start
 * times vs. slots), see content/TODO-cliente.md.
 */
export function nextBroadcast(now = new Date()): { inDays: number; dayLong: string; time: string } | null {
  const { dow, minutes } = romeNow(now);
  const candidates: { inDays: number; dayLong: string; time: string; score: number }[] = [];
  for (let d = 0; d < 8; d++) {
    const day = (dow + d) % 7;
    const row = tv.schedule.find((r) => r.dow === day);
    row?.times.forEach((t) => {
      const score = d * 1440 + toMin(t) - minutes;
      if (score > 0) candidates.push({ inDays: d, dayLong: row.dayLong, time: t, score });
    });
  }
  candidates.sort((a, b) => a.score - b.score);
  const best = candidates[0];
  return best ? { inDays: best.inDays, dayLong: best.dayLong, time: best.time } : null;
}
