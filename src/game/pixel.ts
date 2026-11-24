import Phaser from "phaser";

export type Palette = Record<string, string>;

export function drawPixels(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  palette: Palette,
  ox: number,
  oy: number,
  scale: number,
) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " " || ch === undefined) continue;
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
    }
  }
}

export function canvasTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  paint: (ctx: CanvasRenderingContext2D) => void,
): Phaser.Textures.CanvasTexture {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, width, height);
  if (!tex) throw new Error(`Could not create texture ${key}`);
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = false;
  paint(ctx);
  tex.refresh();
  return tex;
}

export function sheetTexture(
  scene: Phaser.Scene,
  key: string,
  frames: string[][],
  palette: Palette,
  scale: number,
): { frameWidth: number; frameHeight: number; count: number } {
  const fw = frames[0][0].length * scale;
  const fh = frames[0].length * scale;
  canvasTexture(scene, key, fw * frames.length, fh, (ctx) => {
    frames.forEach((rows, i) => drawPixels(ctx, rows, palette, i * fw, 0, scale));
  });
  const tex = scene.textures.get(key);
  for (let i = 0; i < frames.length; i++) {
    tex.add(String(i), 0, i * fw, 0, fw, fh);
  }
  return { frameWidth: fw, frameHeight: fh, count: frames.length };
}

export function stampTexture(
  scene: Phaser.Scene,
  key: string,
  rows: string[],
  palette: Palette,
  scale: number,
) {
  const w = rows[0].length * scale;
  const h = rows.length * scale;
  canvasTexture(scene, key, w, h, (ctx) => drawPixels(ctx, rows, palette, 0, 0, scale));
}
