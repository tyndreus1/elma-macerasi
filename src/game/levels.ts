export type EnemyKind = "mushroom" | "hedgehog" | "snail" | "blob";
export type BossKind = "boss-mushroom" | "boss-hedgehog" | "boss-cloud";
export type TileKind = "grass" | "dirt" | "brick" | "cloud-solid" | "crate";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  tile: TileKind;
}

export interface LevelDef {
  id: number;
  name: string;
  theme: "orman" | "kale" | "bulut";
  sky: string;
  hill: string;
  groundTile: TileKind;
  fillTile: TileKind;
  width: number;
  platforms: Rect[];
  spikes: { x: number; y: number; w: number }[];
  apples: { x: number; y: number }[];
  trees: { x: number; y: number }[];
  bushes: { x: number; y: number }[];
  enemies: { kind: EnemyKind; x: number; y: number; hp?: number }[];
  spawn: [{ x: number; y: number }, { x: number; y: number }];
  boss: { kind: BossKind; name: string; x: number; y: number; hp: number };
  flagX: number;
}

const GROUND_Y = 14; // tiles from top; 14*16=224, sprite stands on it. GAME_H=270

function groundSpan(x: number, w: number, tile: TileKind, y = GROUND_Y, h = 4): Rect {
  return { x, y, w, h, tile };
}

function plat(x: number, y: number, w: number, tile: TileKind): Rect {
  return { x, y, w, h: 1, tile };
}

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: "Orman",
    theme: "orman",
    sky: "sky-orman",
    hill: "hill-light",
    groundTile: "grass",
    fillTile: "dirt",
    width: 150,
    platforms: [
      groundSpan(0, 18, "grass"),
      plat(12, 11, 4, "grass"),
      groundSpan(22, 20, "grass"),
      plat(28, 10, 3, "crate"),
      plat(36, 8, 3, "grass"),
      groundSpan(46, 16, "grass"),
      plat(50, 10, 4, "grass"),
      plat(62, 9, 3, "crate"),
      groundSpan(68, 18, "grass"),
      plat(74, 11, 3, "grass"),
      plat(88, 10, 5, "grass"),
      plat(96, 7, 3, "crate"),
      groundSpan(98, 14, "grass"),
      plat(114, 11, 4, "grass"),
      plat(120, 8, 4, "grass"),
      groundSpan(118, 32, "grass"),
    ],
    spikes: [],
    apples: [
      { x: 8, y: 12 },
      { x: 13, y: 9 },
      { x: 30, y: 8 },
      { x: 37, y: 6 },
      { x: 52, y: 8 },
      { x: 63, y: 7 },
      { x: 75, y: 9 },
      { x: 90, y: 8 },
      { x: 97, y: 5 },
      { x: 116, y: 9 },
      { x: 122, y: 6 },
      { x: 132, y: 12 },
    ],
    trees: [
      { x: 6, y: 10 },
      { x: 26, y: 10 },
      { x: 54, y: 10 },
      { x: 80, y: 10 },
      { x: 108, y: 10 },
      { x: 136, y: 10 },
    ],
    bushes: [
      { x: 4, y: 13 },
      { x: 32, y: 13 },
      { x: 70, y: 13 },
      { x: 104, y: 13 },
    ],
    enemies: [
      { kind: "mushroom", x: 16, y: 13 },
      { kind: "mushroom", x: 24, y: 13 },
      { kind: "hedgehog", x: 34, y: 13 },
      { kind: "mushroom", x: 48, y: 13 },
      { kind: "hedgehog", x: 58, y: 13 },
      { kind: "mushroom", x: 72, y: 13 },
      { kind: "hedgehog", x: 84, y: 13 },
      { kind: "mushroom", x: 92, y: 9 },
      { kind: "hedgehog", x: 102, y: 13 },
      { kind: "mushroom", x: 118, y: 13 },
    ],
    spawn: [
      { x: 3, y: 12 },
      { x: 5, y: 12 },
    ],
    boss: { kind: "boss-mushroom", name: "Kral Mantar", x: 140, y: 11, hp: 6 },
    flagX: 147,
  },
  {
    id: 2,
    name: "Kale",
    theme: "kale",
    sky: "sky-kale",
    hill: "hill-castle",
    groundTile: "brick",
    fillTile: "brick",
    width: 160,
    platforms: [
      groundSpan(0, 16, "brick"),
      plat(10, 11, 3, "crate"),
      plat(18, 9, 4, "brick"),
      groundSpan(24, 12, "brick"),
      plat(28, 10, 3, "brick"),
      plat(38, 8, 4, "crate"),
      plat(44, 12, 3, "brick"),
      groundSpan(50, 14, "brick"),
      plat(54, 9, 3, "brick"),
      plat(64, 7, 4, "crate"),
      plat(72, 11, 5, "brick"),
      groundSpan(80, 16, "brick"),
      plat(86, 10, 3, "brick"),
      plat(96, 8, 4, "brick"),
      plat(104, 6, 3, "crate"),
      groundSpan(110, 12, "brick"),
      plat(124, 10, 5, "brick"),
      plat(132, 8, 3, "crate"),
      groundSpan(128, 32, "brick"),
    ],
    spikes: [
      { x: 16, y: 13, w: 2 },
      { x: 36, y: 13, w: 3 },
      { x: 66, y: 13, w: 3 },
      { x: 98, y: 13, w: 2 },
      { x: 122, y: 13, w: 2 },
    ],
    apples: [
      { x: 11, y: 9 },
      { x: 19, y: 7 },
      { x: 29, y: 8 },
      { x: 39, y: 6 },
      { x: 45, y: 10 },
      { x: 55, y: 7 },
      { x: 65, y: 5 },
      { x: 74, y: 9 },
      { x: 87, y: 8 },
      { x: 97, y: 6 },
      { x: 105, y: 4 },
      { x: 126, y: 8 },
      { x: 133, y: 6 },
    ],
    trees: [],
    bushes: [
      { x: 6, y: 13 },
      { x: 82, y: 13 },
      { x: 140, y: 13 },
    ],
    enemies: [
      { kind: "snail", x: 14, y: 13, hp: 2 },
      { kind: "hedgehog", x: 26, y: 13 },
      { kind: "snail", x: 32, y: 13, hp: 2 },
      { kind: "blob", x: 42, y: 11 },
      { kind: "hedgehog", x: 52, y: 13 },
      { kind: "snail", x: 60, y: 13, hp: 2 },
      { kind: "blob", x: 74, y: 10 },
      { kind: "hedgehog", x: 84, y: 13 },
      { kind: "snail", x: 92, y: 13, hp: 2 },
      { kind: "blob", x: 106, y: 5 },
      { kind: "hedgehog", x: 114, y: 13 },
      { kind: "snail", x: 128, y: 9, hp: 2 },
    ],
    spawn: [
      { x: 3, y: 12 },
      { x: 5, y: 12 },
    ],
    boss: { kind: "boss-hedgehog", name: "Şövalye Kirpi", x: 148, y: 11, hp: 8 },
    flagX: 157,
  },
  {
    id: 3,
    name: "Bulutlar",
    theme: "bulut",
    sky: "sky-bulut",
    hill: "hill-cloud",
    groundTile: "cloud-solid",
    fillTile: "cloud-solid",
    width: 155,
    platforms: [
      groundSpan(0, 12, "cloud-solid", GROUND_Y, 2),
      plat(14, 12, 4, "cloud-solid"),
      plat(20, 9, 4, "cloud-solid"),
      plat(28, 11, 5, "cloud-solid"),
      plat(36, 8, 4, "cloud-solid"),
      plat(44, 12, 4, "cloud-solid"),
      plat(50, 9, 5, "cloud-solid"),
      plat(58, 6, 3, "crate"),
      plat(64, 11, 5, "cloud-solid"),
      plat(72, 8, 4, "cloud-solid"),
      plat(80, 12, 4, "cloud-solid"),
      plat(86, 9, 5, "cloud-solid"),
      plat(94, 6, 4, "cloud-solid"),
      plat(102, 10, 5, "cloud-solid"),
      plat(110, 7, 4, "cloud-solid"),
      plat(118, 12, 4, "cloud-solid"),
      plat(124, 9, 4, "cloud-solid"),
      groundSpan(122, 33, "cloud-solid", GROUND_Y, 2),
    ],
    spikes: [],
    apples: [
      { x: 15, y: 10 },
      { x: 21, y: 7 },
      { x: 30, y: 9 },
      { x: 37, y: 6 },
      { x: 45, y: 10 },
      { x: 52, y: 7 },
      { x: 59, y: 4 },
      { x: 66, y: 9 },
      { x: 73, y: 6 },
      { x: 81, y: 10 },
      { x: 88, y: 7 },
      { x: 96, y: 4 },
      { x: 104, y: 8 },
      { x: 111, y: 5 },
      { x: 125, y: 7 },
    ],
    trees: [
      { x: 4, y: 10 },
      { x: 134, y: 10 },
    ],
    bushes: [
      { x: 8, y: 13 },
      { x: 138, y: 13 },
    ],
    enemies: [
      { kind: "blob", x: 16, y: 11 },
      { kind: "snail", x: 22, y: 8, hp: 2 },
      { kind: "blob", x: 30, y: 10 },
      { kind: "mushroom", x: 38, y: 7 },
      { kind: "blob", x: 46, y: 11 },
      { kind: "hedgehog", x: 52, y: 8 },
      { kind: "blob", x: 66, y: 10 },
      { kind: "snail", x: 74, y: 7, hp: 2 },
      { kind: "blob", x: 82, y: 11 },
      { kind: "mushroom", x: 88, y: 8 },
      { kind: "blob", x: 96, y: 5 },
      { kind: "hedgehog", x: 104, y: 9 },
      { kind: "blob", x: 112, y: 6 },
      { kind: "snail", x: 126, y: 8, hp: 2 },
    ],
    spawn: [
      { x: 3, y: 12 },
      { x: 5, y: 12 },
    ],
    boss: { kind: "boss-cloud", name: "Bulut Kralı", x: 144, y: 11, hp: 8 },
    flagX: 152,
  },
];

export function worldWidth(level: LevelDef) {
  return level.width * 16;
}
