/**
 * "Stage ready" signal: fired when the opening curtain starts to part (or at
 * once when the preloader is skipped / already seen this session). Entrance
 * choreography above the fold waits for it so nothing plays behind the velvet.
 */
let ready = false;
const subs = new Set<() => void>();

function isReadyFromDom() {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.stage === "ready";
}

export function markStageReady() {
  if (ready) return;
  ready = true;
  if (typeof document !== "undefined") document.documentElement.dataset.stage = "ready";
  subs.forEach((fn) => fn());
  subs.clear();
}

export function onStageReady(cb: () => void): () => void {
  if (ready || isReadyFromDom()) {
    ready = true;
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

/**
 * True when the stage was already lit before this component mounted (no
 * preloader this session, or it has finished). Entrance choreography above
 * the fold is skipped in that case so nothing visible is hidden and replayed.
 */
export function stageAlreadyReady() {
  return ready || isReadyFromDom();
}
