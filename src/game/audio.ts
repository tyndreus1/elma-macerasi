/** Tiny WebAudio chiptune bus — no asset files. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
  }
  return ctx;
}

export async function resumeAudio() {
  const c = ac();
  if (c && c.state === "suspended") await c.resume();
}

export function setMuted(v: boolean) {
  muted = v;
  if (master) master.gain.value = v ? 0 : 0.22;
}

export function isMuted() {
  return muted;
}

function beep(freq: number, dur: number, type: OscillatorType, vol = 0.8, slide?: number) {
  const c = ac();
  if (!c || !master || muted) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(dur: number, vol = 0.4) {
  const c = ac();
  if (!c || !master || muted) return;
  const n = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = n.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = c.createBufferSource();
  src.buffer = n;
  const g = c.createGain();
  g.gain.value = vol;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1200;
  src.connect(f);
  f.connect(g);
  g.connect(master);
  src.start();
}

export const sfx = {
  jump: () => beep(520, 0.12, "square", 0.4, 280),
  throw: () => beep(640, 0.08, "square", 0.35, 320),
  kick: () => beep(180, 0.1, "sawtooth", 0.35, 90),
  collect: () => {
    beep(660, 0.07, "square", 0.35);
    setTimeout(() => beep(880, 0.09, "square", 0.3), 60);
  },
  hit: () => {
    beep(220, 0.12, "square", 0.4, 90);
    noise(0.08, 0.2);
  },
  hurt: () => {
    beep(160, 0.22, "sawtooth", 0.45, 70);
    noise(0.12, 0.25);
  },
  pop: () => beep(320, 0.16, "triangle", 0.4, 140),
  land: () => beep(140, 0.06, "triangle", 0.2),
  ui: () => beep(440, 0.06, "square", 0.25),
  start: () => {
    beep(392, 0.1, "square", 0.35);
    setTimeout(() => beep(523, 0.1, "square", 0.35), 90);
    setTimeout(() => beep(659, 0.18, "square", 0.4), 180);
  },
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.16, "square", 0.35), i * 110));
  },
  lose: () => {
    [392, 330, 262, 196].forEach((f, i) => setTimeout(() => beep(f, 0.2, "triangle", 0.35), i * 140));
  },
  boss: () => {
    beep(110, 0.25, "sawtooth", 0.4);
    setTimeout(() => beep(147, 0.3, "sawtooth", 0.35), 180);
  },
  drop: () => beep(880, 0.05, "triangle", 0.2, 440),
};
