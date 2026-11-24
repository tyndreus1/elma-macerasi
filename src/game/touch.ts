import { queueJump, queueThrow, sticks, type Stick } from "./input";

let bound = false;

let wantVisible = false;

function isTouchDevice() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return coarse || noHover;
}

function shouldShow() {
  if (!wantVisible) return false;
  const q = new URLSearchParams(location.search);
  if (q.get("touch") === "1") return true;
  return isTouchDevice();
}

export function showTouch(show: boolean) {
  wantVisible = show;
  const root = document.getElementById("touch-root");
  if (!root) return;
  const want = shouldShow();
  root.hidden = !want;
  root.setAttribute("data-active", want ? "1" : "0");
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", () => showTouch(wantVisible));
}

export function setTwoPlayerTouch(two: boolean) {
  const root = document.getElementById("touch-root");
  if (!root) return;
  root.dataset.mode = two ? "two" : "one";
}

function bindButton(el: HTMLElement) {
  const pid = Number(el.dataset.p) as 0 | 1;
  const act = el.dataset.act as keyof Stick;
  const set = (v: boolean) => {
    const s = sticks[pid];
    if (act === "left" || act === "right" || act === "jump" || act === "throw") {
      (s as unknown as Record<string, boolean>)[act] = v;
    }
    if (v && act === "jump") queueJump(pid);
    if (v && act === "throw") queueThrow(pid);
  };
  const on = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (e instanceof PointerEvent) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    el.classList.add("held");
    set(true);
  };
  const off = (e: Event) => {
    e.preventDefault();
    el.classList.remove("held");
    set(false);
  };
  el.addEventListener("pointerdown", on);
  el.addEventListener("pointerup", off);
  el.addEventListener("pointercancel", off);
  el.addEventListener("pointerleave", off);
  el.addEventListener("contextmenu", (e) => e.preventDefault());
}

export function bindTouchDom() {
  if (bound) return;
  bound = true;
  document.querySelectorAll<HTMLElement>("#touch-root [data-act]").forEach(bindButton);
  document.body.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false },
  );
  document.addEventListener(
    "gesturestart",
    (e) => {
      e.preventDefault();
    },
    { passive: false },
  );
}
