import Phaser from "phaser";
import { canvasTexture } from "./pixel";

/** 5x7 bitmap rows, bit4 = leftmost pixel. */
const GLYPHS: Record<string, number[]> = {
  " ": [0, 0, 0, 0, 0, 0, 0],
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  Ç: [0b01110, 0b10001, 0b10000, 0b10000, 0b10001, 0b01110, 0b00100],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  Ğ: [0b00100, 0b01110, 0b10001, 0b10111, 0b10001, 0b10001, 0b01110],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  İ: [0b00100, 0b00000, 0b01110, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10101, 0b10011, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  Ö: [0b01010, 0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  Ş: [0b01110, 0b10000, 0b01110, 0b00001, 0b11110, 0b00100, 0b00100],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  Ü: [0b01010, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010],
  X: [0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b01010, 0b10001],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  a: [0, 0b01110, 0b00001, 0b01111, 0b10001, 0b10001, 0b01111],
  b: [0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b10001, 0b11110],
  c: [0, 0, 0b01110, 0b10000, 0b10000, 0b10000, 0b01110],
  ç: [0, 0b01110, 0b10000, 0b10000, 0b01110, 0b00100, 0b01000],
  d: [0b00001, 0b00001, 0b01111, 0b10001, 0b10001, 0b10001, 0b01111],
  e: [0, 0, 0b01110, 0b10001, 0b11111, 0b10000, 0b01110],
  f: [0b00110, 0b01000, 0b11100, 0b01000, 0b01000, 0b01000, 0b01000],
  g: [0, 0b01111, 0b10001, 0b10001, 0b01111, 0b00001, 0b01110],
  ğ: [0b00100, 0b01111, 0b10001, 0b01111, 0b00001, 0b01110, 0],
  h: [0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b10001, 0b10001],
  i: [0b00100, 0, 0b01100, 0b00100, 0b00100, 0b00100, 0b01110],
  ı: [0, 0, 0b01100, 0b00100, 0b00100, 0b00100, 0b01110],
  j: [0b00010, 0, 0b00110, 0b00010, 0b00010, 0b10010, 0b01100],
  k: [0b10000, 0b10000, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010],
  l: [0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  m: [0, 0, 0b11010, 0b10101, 0b10101, 0b10101, 0b10101],
  n: [0, 0, 0b11110, 0b10001, 0b10001, 0b10001, 0b10001],
  o: [0, 0, 0b01110, 0b10001, 0b10001, 0b10001, 0b01110],
  ö: [0b01010, 0, 0b01110, 0b10001, 0b10001, 0b10001, 0b01110],
  p: [0, 0b11110, 0b10001, 0b11110, 0b10000, 0b10000, 0],
  r: [0, 0, 0b10110, 0b11000, 0b10000, 0b10000, 0b10000],
  s: [0, 0, 0b01110, 0b10000, 0b01110, 0b00001, 0b11110],
  ş: [0, 0b01110, 0b10000, 0b01110, 0b00001, 0b11110, 0b00100],
  t: [0b01000, 0b01000, 0b11100, 0b01000, 0b01000, 0b01000, 0b00110],
  u: [0, 0, 0b10001, 0b10001, 0b10001, 0b10011, 0b01101],
  ü: [0b01010, 0, 0b10001, 0b10001, 0b10001, 0b10011, 0b01101],
  v: [0, 0, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  y: [0, 0, 0b10001, 0b10001, 0b01111, 0b00001, 0b01110],
  z: [0, 0, 0b11111, 0b00010, 0b00100, 0b01000, 0b11111],
  "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  "2": [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  "3": [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  "6": [0b01110, 0b10000, 0b11110, 0b10001, 0b10001, 0b10001, 0b01110],
  "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  "8": [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  "9": [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b01110],
  "!": [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0, 0b00100],
  "?": [0b01110, 0b10001, 0b00001, 0b00110, 0b00100, 0, 0b00100],
  ".": [0, 0, 0, 0, 0, 0, 0b00100],
  ",": [0, 0, 0, 0, 0, 0b00100, 0b01000],
  ":": [0, 0b00100, 0, 0, 0, 0b00100, 0],
  "'": [0b00100, 0b00100, 0, 0, 0, 0, 0],
  "-": [0, 0, 0, 0b11111, 0, 0, 0],
  "+": [0, 0b00100, 0b00100, 0b11111, 0b00100, 0b00100, 0],
  x: [0, 0, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001],
  "/": [0b00001, 0b00010, 0b00010, 0b00100, 0b01000, 0b01000, 0b10000],
  "*": [0b00100, 0b10101, 0b01110, 0b00100, 0b01110, 0b10101, 0b00100],
};

const CELL_W = 6;
const CELL_H = 8;

export function buildFont(scene: Phaser.Scene) {
  const keys = Object.keys(GLYPHS);
  const cols = 16;
  const rows = Math.ceil(keys.length / cols);
  const scale = 1;
  const tex = canvasTexture(scene, "pixelfont", cols * CELL_W * scale, rows * CELL_H * scale, (ctx) => {
    ctx.fillStyle = "#ffffff";
    keys.forEach((ch, i) => {
      const bits = GLYPHS[ch];
      const cx = (i % cols) * CELL_W;
      const cy = Math.floor(i / cols) * CELL_H;
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 5; x++) {
          if (bits[y] & (1 << (4 - x))) {
            ctx.fillRect((cx + x) * scale, (cy + y) * scale, scale, scale);
          }
        }
      }
    });
  });
  keys.forEach((ch, i) => {
    const cx = (i % cols) * CELL_W;
    const cy = Math.floor(i / cols) * CELL_H;
    tex.add(ch, 0, cx, cy, CELL_W, CELL_H);
  });
}

export function pixelText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  opts?: {
    scale?: number;
    color?: number;
    originX?: number;
    originY?: number;
    depth?: number;
    scrollFactor?: number;
    stroke?: boolean;
  },
): Phaser.GameObjects.Container {
  const scale = opts?.scale ?? 1;
  const color = opts?.color ?? 0xffffff;
  const container = scene.add.container(x, y);
  container.setDepth(opts?.depth ?? 40);
  if (opts?.scrollFactor !== undefined) container.setScrollFactor(opts.scrollFactor);

  const letters: Phaser.GameObjects.Image[] = [];
  let cx = 0;
  for (const raw of text) {
    const ch = GLYPHS[raw] ? raw : GLYPHS[raw.toUpperCase()] ? raw.toUpperCase() : " ";
    if (opts?.stroke) {
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const outline = scene.add.image(cx + dx, dy, "pixelfont", ch);
        outline.setOrigin(0, 0);
        outline.setTint(0x1a1020);
        outline.setScale(scale);
        letters.push(outline);
      }
    }
    const img = scene.add.image(cx, 0, "pixelfont", ch);
    img.setOrigin(0, 0);
    img.setTint(color);
    img.setScale(scale);
    letters.push(img);
    cx += CELL_W * scale;
  }
  container.add(letters);
  const w = Math.max(1, text.length) * CELL_W * scale;
  const h = CELL_H * scale;
  container.setSize(w, h);
  container.setData("w", w);
  container.setData("h", h);
  container.setPosition(x - w * (opts?.originX ?? 0), y - h * (opts?.originY ?? 0));
  return container;
}

export function replacePixelText(container: Phaser.GameObjects.Container, text: string, color?: number) {
  const scale = (container.list[0] as Phaser.GameObjects.Image | undefined)?.scaleX ?? 1;
  const tint = color ?? 0xffffff;
  container.removeAll(true);
  let cx = 0;
  for (const raw of text) {
    const ch = GLYPHS[raw] ? raw : GLYPHS[raw.toUpperCase()] ? raw.toUpperCase() : " ";
    const img = container.scene.add.image(cx, 0, "pixelfont", ch);
    img.setOrigin(0, 0);
    img.setTint(tint);
    img.setScale(scale);
    container.add(img);
    cx += CELL_W * scale;
  }
  const w = Math.max(1, text.length) * CELL_W * scale;
  container.setSize(w, CELL_H * scale);
  container.setData("w", w);
}
