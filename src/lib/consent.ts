"use client";

import { useSyncExternalStore } from "react";

/**
 * Consent store. The site sets no profiling or analytics cookies at all; the
 * only optional category is third-party content (Google Maps embed), which is
 * never loaded before an explicit "Accetta". Technical storage (this choice,
 * the "preloader seen" flag) needs no consent.
 */
export type Consent = { v: 1; external: boolean; at: string };

const KEY = "ingromoda-consent";
const EVT = "ingromoda:consent";
const OPEN_EVT = "ingromoda:consent-open";

function read(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c?.v === 1 ? c : null;
  } catch {
    return null;
  }
}

let cache: Consent | null | undefined;
let cacheRaw: string | null = null;

function snapshot(): Consent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (cache === undefined || raw !== cacheRaw) {
    cacheRaw = raw;
    cache = read();
  }
  return cache;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function saveConsent(external: boolean) {
  const c: Consent = { v: 1, external, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* private mode: the choice lasts for this page view */
    cache = c;
  }
  window.dispatchEvent(new Event(EVT));
}

/** undefined while not hydrated, null when no choice has been made yet. */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, snapshot, () => undefined);
}

export function openConsentPanel() {
  window.dispatchEvent(new Event(OPEN_EVT));
}

export function onConsentPanelOpen(cb: () => void) {
  window.addEventListener(OPEN_EVT, cb);
  return () => window.removeEventListener(OPEN_EVT, cb);
}
