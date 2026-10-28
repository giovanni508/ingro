import { features, site } from "@/lib/site";
import { OpenNow } from "./OpenNow";

/**
 * Store opening hours, as published on the old Contatti page. Always labelled
 * as shop hours so they can't be confused with the TV schedule.
 */
export function OpeningHours({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const h = site.openingHours;
  const dim = tone === "dark" ? "text-ivory-dim" : "text-char-dim";
  const fmt = (slots: string[][]) => slots.map(([a, b]) => `${a.replace(/^0/, "")}-${b}`).join(" · ");
  return (
    <div className={className}>
      <p className={`t-label flex items-center gap-4 ${dim}`}>
        Orari del negozio {features.openNow ? <OpenNow /> : null}
      </p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[0.9375rem]">
        <dt className={dim}>Lun - Sab</dt>
        <dd className="tnum">{fmt(h.weekdays.slots)}</dd>
        <dt className={dim}>Domenica</dt>
        <dd>
          <span className="tnum">{fmt(h.sunday.slots)}</span>
          <span className={`block text-sm ${dim}`}>
            {h.sunday.label}, {h.sunday.detail}
          </span>
        </dd>
      </dl>
      <p className={`mt-2 text-sm ${dim}`}>{h.holidays}</p>
    </div>
  );
}
