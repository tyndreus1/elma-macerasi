import type Phaser from "phaser";

/** Ensures Foe playWalk() finds boss-*-walk keys even if sprites.ts still uses the old names. */
export function ensureBossWalkAnims(scene: Phaser.Scene) {
  const specs: [string, string, number][] = [
    ["boss-mushroom-walk", "boss-mushroom", 3],
    ["boss-hedgehog-walk", "boss-hedgehog", 4],
    ["boss-cloud-walk", "boss-cloud", 3],
  ];
  for (const [key, tex, rate] of specs) {
    if (scene.anims.exists(key)) continue;
    scene.anims.create({
      key,
      frames: [
        { key: tex, frame: "0" },
        { key: tex, frame: "1" },
      ],
      frameRate: rate,
      repeat: -1,
    });
  }
}
