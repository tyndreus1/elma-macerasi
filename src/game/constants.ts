export const GAME_W = 480;
export const GAME_H = 270;
export const TILE = 16;
export const GRAVITY = 980;
export const PLAYER_SPEED = 145;
export const JUMP_VELOCITY = -340;
export const THROW_SPEED = 280;
export const MAX_APPLES = 9;
export const START_LIVES = 3;
export const START_APPLES = 5;
export const INVULN_MS = 1800;
export const COYOTE_MS = 90;
export const JUMP_BUFFER_MS = 110;

export const DEPTH = {
  sky: 0,
  far: 1,
  mid: 2,
  platforms: 5,
  deco: 6,
  actors: 10,
  projectiles: 12,
  fx: 14,
  hud: 30,
  overlay: 40,
};

export type PlayerId = 0 | 1;

export const PLAYER_META = [
  { id: 0 as PlayerId, name: "Murat", short: "P1", tint: 0x5b8cff },
  { id: 1 as PlayerId, name: "Ege", short: "P2", tint: 0xffb347 },
];
