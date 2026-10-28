"use client";

import { openConsentPanel } from "@/lib/consent";

export function ManageCookies() {
  return (
    <button type="button" onClick={openConsentPanel} className="link-trace cursor-pointer">
      Preferenze cookie
    </button>
  );
}
