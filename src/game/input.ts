import type { PlayerId } from "./constants";

export interface Stick {
  left: boolean;
  right: boolean;
  jump: boolean;
  throw: boolean;
  jumpQueued: boolean;
  throwQueued: boolean;
}

export const sticks: [Stick, Stick] = [
  { left: false, right: false, jump: false, throw: false, jumpQueued: false, throwQueued: false },
  { left: false, right: false, jump: false, throw: false, jumpQueued: false, throwQueued: false },
];

export function queueJump(id: PlayerId) {
  sticks[id].jumpQueued = true;
  sticks[id].jump = true;
}
export function queueThrow(id: PlayerId) {
  sticks[id].throwQueued = true;
  sticks[id].throw = true;
}

export function consumeJump(id: PlayerId) {
  const v = sticks[id].jumpQueued;
  sticks[id].jumpQueued = false;
  return v;
}
export function consumeThrow(id: PlayerId) {
  const v = sticks[id].throwQueued;
  sticks[id].throwQueued = false;
  return v;
}

export function resetSticks() {
  for (const s of sticks) {
    s.left = s.right = s.jump = s.throw = s.jumpQueued = s.throwQueued = false;
  }
}

let kbBound = false;
const down = new Set<string>();

export function bindKeyboard() {
  if (kbBound) return;
  kbBound = true;
  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Space"].includes(e.key)) {
      e.preventDefault();
    }
    if (e.repeat) return;
    down.add(e.code);
    if (e.code === "KeyW" || e.code === "Space") queueJump(0);
    if (e.code === "KeyF" || e.code === "ShiftLeft" || e.code === "KeyG") queueThrow(0);
    if (e.code === "ArrowUp") queueJump(1);
    if (e.code === "KeyK" || e.code === "KeyL" || e.code === "Period") queueThrow(1);
  });
  window.addEventListener("keyup", (e) => {
    down.delete(e.code);
  });
  window.addEventListener("blur", () => {
    down.clear();
    resetSticks();
  });
}

export function pollKeyboard() {
  const p1 = sticks[0];
  const p2 = sticks[1];
  p1.left = down.has("KeyA");
  p1.right = down.has("KeyD");
  p1.jump = down.has("KeyW") || down.has("Space") || p1.jumpQueued;
  p1.throw = down.has("KeyF") || down.has("ShiftLeft") || down.has("KeyG") || p1.throwQueued;
  p2.left = down.has("ArrowLeft");
  p2.right = down.has("ArrowRight");
  p2.jump = down.has("ArrowUp") || p2.jumpQueued;
  p2.throw = down.has("KeyK") || down.has("KeyL") || down.has("Period") || p2.throwQueued;
}

export async function tryFullscreenAndLandscape() {
  const el = document.documentElement;
  try {
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen();
    }
  } catch {
    /* browsers may deny until a later gesture */
  }
  try {
    const ori = screen.orientation as ScreenOrientation & { lock?: (m: string) => Promise<void> };
    if (ori?.lock) await ori.lock("landscape");
  } catch {
    /* iOS and many desktop browsers do not allow lock */
  }
}
