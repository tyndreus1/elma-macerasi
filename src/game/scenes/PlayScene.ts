import Phaser from "phaser";
import { DEPTH, GAME_H, GAME_W, PLAYER_META, TILE } from "../constants";
import { LEVELS, worldWidth, type LevelDef } from "../levels";
import { Foe, Hero } from "../actors";
import { pollKeyboard } from "../input";
import { sfx } from "../audio";
import { pixelText, replacePixelText } from "../font";
import { particleBurst } from "../sprites";
import { showTouch } from "../touch";

interface Carry {
  apples: number[];
  lives: number[];
  score: number[];
}

export class PlayScene extends Phaser.Scene {
  private level!: LevelDef;
  private heroes: Hero[] = [];
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private foes!: Phaser.Physics.Arcade.Group;
  private pickups!: Phaser.Physics.Arcade.Group;
  private shots!: Phaser.Physics.Arcade.Group;
  private melee!: Phaser.Physics.Arcade.Group;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private boss: Foe | null = null;
  private bossSpawned = false;
  private ended = false;
  private hud: {
    hearts: Phaser.GameObjects.Image[][];
    apples: Phaser.GameObjects.Container[];
    scores: Phaser.GameObjects.Container[];
  } = { hearts: [[], []], apples: [], scores: [] };
  private camLock = false;
  private worldW = 0;

  constructor() {
    super("play");
  }

  create() {
    showTouch(true);
    this.ended = false;
    this.boss = null;
    this.bossSpawned = false;
    this.camLock = false;
    const idx = (this.registry.get("level") as number) ?? 0;
    this.level = LEVELS[idx];
    this.worldW = worldWidth(this.level);
    this.physics.world.setBounds(0, 0, this.worldW, GAME_H + 80);
    this.cameras.main.setBounds(0, 0, this.worldW, GAME_H);
    this.cameras.main.setBackgroundColor(0x7ec8f8);

    this.add.tileSprite(0, 0, this.worldW, GAME_H, this.level.sky).setOrigin(0).setScrollFactor(0).setDepth(DEPTH.sky);
    this.add
      .tileSprite(0, 150, this.worldW, 48, this.level.hill)
      .setOrigin(0)
      .setScrollFactor(0.25)
      .setDepth(DEPTH.far)
      .setAlpha(0.85);

    this.platforms = this.physics.add.staticGroup();
    this.spikes = this.physics.add.staticGroup();
    this.foes = this.physics.add.group({ runChildUpdate: false });
    this.pickups = this.physics.add.group();
    this.shots = this.physics.add.group();
    this.melee = this.physics.add.group();

    this.buildTerrain();
    this.spawnActors();
    this.buildHud();
    this.wireCollisions();

    const banner = pixelText(this, GAME_W / 2, 40, this.level.name.toUpperCase(), {
      scale: 2,
      color: 0xfff6c8,
      originX: 0.5,
      stroke: true,
      scrollFactor: 0,
    });
    this.tweens.add({
      targets: banner,
      y: 28,
      alpha: 0,
      delay: 1200,
      duration: 600,
      onComplete: () => banner.destroy(),
    });

    this.time.addEvent({ delay: 3800, loop: true, callback: () => this.dropFromTrees() });

    const jumpBoss =
      this.registry.get("startAtBoss") === true ||
      new URLSearchParams(typeof location !== "undefined" ? location.search : "").get("boss") === "1";
    if (jumpBoss) {
      this.registry.set("startAtBoss", false);
      const bx = this.level.boss.x * TILE - 160;
      this.heroes.forEach((h, i) => {
        h.setPosition(bx + i * 28, 180);
        h.lastSafeX = h.x;
        h.lastSafeY = h.y;
        h.invulnUntil = this.time.now + 3500;
      });
      this.cameras.main.centerOn(this.level.boss.x * TILE - 40, GAME_H / 2);
      this.maybeSpawnBoss();
    }
  }

  private buildTerrain() {
    const L = this.level;
    for (const p of L.platforms) {
      for (let ty = 0; ty < p.h; ty++) {
        for (let tx = 0; tx < p.w; tx++) {
          const tileKey = ty === 0 ? p.tile : L.fillTile;
          const img = this.platforms
            .create((p.x + tx) * TILE + TILE / 2, (p.y + ty) * TILE + TILE / 2, tileKey)
            .setDepth(DEPTH.platforms) as Phaser.Physics.Arcade.Sprite;
          img.refreshBody();
        }
      }
    }
    for (const s of L.spikes) {
      for (let tx = 0; tx < s.w; tx++) {
        const sp = this.spikes
          .create((s.x + tx) * TILE + TILE / 2, s.y * TILE + TILE / 2, "spike")
          .setDepth(DEPTH.deco) as Phaser.Physics.Arcade.Sprite;
        sp.refreshBody();
        const b = sp.body as Phaser.Physics.Arcade.StaticBody;
        b.setSize(12, 10);
        b.setOffset(2, 6);
      }
    }
    for (const t of L.trees) {
      this.add
        .image(t.x * TILE + 8, 14 * TILE, "tree")
        .setOrigin(0.5, 1)
        .setDepth(DEPTH.deco);
    }
    for (const b of L.bushes) {
      this.add
        .image(b.x * TILE + 8, 14 * TILE, "bush")
        .setOrigin(0.5, 1)
        .setDepth(DEPTH.deco);
    }
    this.add
      .image(L.flagX * TILE, GROUND_TOP(L) * TILE, "flag")
      .setOrigin(0, 1)
      .setDepth(DEPTH.deco);

    for (const a of L.apples) {
      this.spawnPickup(a.x * TILE + 8, a.y * TILE + 8, false);
    }
  }

  private spawnActors() {
    const players = (this.registry.get("players") as 1 | 2) ?? 1;
    const carry = this.registry.get("carry") as Carry | null;
    this.heroes = [];
    for (let i = 0; i < players; i++) {
      const s = this.level.spawn[i];
      const h = new Hero(this, s.x * TILE + 8, s.y * TILE, i as 0 | 1);
      if (carry) {
        h.apples = carry.apples[i] ?? h.apples;
        h.lives = Math.max(1, carry.lives[i] ?? h.lives);
        h.score = carry.score[i] ?? 0;
      }
      this.heroes.push(h);
      h.invulnUntil = this.time.now + 2000;
    }
    for (const e of this.level.enemies) {
      const foe = new Foe(this, e.x * TILE + 8, e.y * TILE, e.kind, e.hp ?? 1);
      this.foes.add(foe);
    }
  }

  private buildHud() {
    const n = this.heroes.length;
    for (let i = 0; i < n; i++) {
      const x = i === 0 ? 8 : GAME_W - 8;
      const originX = i === 0 ? 0 : 1;
      const dir = i === 0 ? 1 : -1;
      pixelText(this, x, 4, PLAYER_META[i].name, {
        scale: 1,
        color: PLAYER_META[i].tint,
        originX,
        stroke: true,
        scrollFactor: 0,
        depth: DEPTH.hud,
      });
      const hearts: Phaser.GameObjects.Image[] = [];
      for (let k = 0; k < 3; k++) {
        const hx = i === 0 ? 8 + k * 14 : GAME_W - 8 - k * 14;
        const im = this.add.image(hx, 20, "heart").setOrigin(originX, 0).setScrollFactor(0).setDepth(DEPTH.hud);
        hearts.push(im);
      }
      this.hud.hearts[i] = hearts;
      const appleIcon = this.add
        .image(i === 0 ? 8 : GAME_W - 52, 34, "apple")
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(DEPTH.hud)
        .setScale(0.9);
      void appleIcon;
      const apples = pixelText(this, i === 0 ? 24 : GAME_W - 8, 36, "x3", {
        scale: 1,
        color: 0xffe080,
        originX: i === 0 ? 0 : 1,
        stroke: true,
        scrollFactor: 0,
        depth: DEPTH.hud,
      });
      this.hud.apples[i] = apples;
      const scores = pixelText(this, x, 50, "0", {
        scale: 1,
        color: 0xffffff,
        originX,
        stroke: true,
        scrollFactor: 0,
        depth: DEPTH.hud,
      });
      this.hud.scores[i] = scores;
      void dir;
    }
  }

  private refreshHud() {
    this.heroes.forEach((h, i) => {
      this.hud.hearts[i]?.forEach((im, k) => {
        im.setTexture(k < h.lives ? "heart" : "heart-empty");
      });
      const ax = i === 0 ? this.hud.apples[i].x : this.hud.apples[i].x;
      void ax;
      replacePixelText(this.hud.apples[i], `x${h.apples}`, 0xffe080);
      const scoreStr = String(h.score).padStart(4, "0");
      const prevX = this.hud.scores[i].x;
      const originX = i === 0 ? 0 : 1;
      replacePixelText(this.hud.scores[i], scoreStr, 0xffffff);
      const w = this.hud.scores[i].getData("w") as number;
      if (originX === 1) this.hud.scores[i].x = GAME_W - 8 - w;
      else this.hud.scores[i].x = prevX;
      if (i === 1) {
        const aw = this.hud.apples[i].getData("w") as number;
        this.hud.apples[i].x = GAME_W - 8 - aw;
      }
    });
  }

  private wireCollisions() {
    this.heroes.forEach((h) => {
      this.physics.add.collider(h, this.platforms);
    });
    this.physics.add.collider(this.foes, this.platforms);
    this.physics.add.collider(this.pickups, this.platforms);
    this.physics.add.collider(this.shots, this.platforms, (shot) => {
      (shot as Phaser.Physics.Arcade.Sprite).destroy();
    });

    this.heroes.forEach((h) => {
      this.physics.add.overlap(h, this.pickups, (_pl, apple) => {
        const a = apple as Phaser.Physics.Arcade.Sprite;
        if (!a.active) return;
        h.addApple(1);
        sfx.collect();
        particleBurst(this, a.x, a.y, 0xff5050);
        a.destroy();
      });
      this.physics.add.overlap(h, this.foes, (_pl, foe) => {
        const f = foe as Foe;
        if (!f.active) return;
        h.hurt(this, false);
      });
      this.physics.add.overlap(h, this.spikes, () => h.hurt(this, false));
    });

    this.physics.add.overlap(this.shots, this.foes, (shot, foe) => {
      const s = shot as Phaser.Physics.Arcade.Sprite;
      const f = foe as Foe;
      if (!s.active || !f.active) return;
      const owner = this.heroes[s.getData("owner") as number];
      s.destroy();
      const dead = f.takeHit(this, s.x, 1);
      if (dead && owner) {
        owner.score += f.scoreValue;
        if (Math.random() < 0.35) this.spawnPickup(f.x, f.y - 8, true);
        if (f.isBoss) this.onBossDown();
      }
    });
    this.physics.add.overlap(this.melee, this.foes, (kick, foe) => {
      const k = kick as Phaser.Physics.Arcade.Sprite;
      const f = foe as Foe;
      if (!k.active || !f.active) return;
      const owner = this.heroes[k.getData("owner") as number];
      k.destroy();
      const dead = f.takeHit(this, k.x, 1);
      if (dead && owner) {
        owner.score += f.scoreValue;
        if (f.isBoss) this.onBossDown();
      }
    });
  }

  private spawnPickup(x: number, y: number, physics: boolean) {
    const a = this.pickups.create(x, y, "apple") as Phaser.Physics.Arcade.Sprite;
    a.setDepth(DEPTH.projectiles);
    const b = a.body as Phaser.Physics.Arcade.Body;
    b.setAllowGravity(physics);
    b.setBounce(0.3);
    if (!physics) b.setImmovable(true);
    return a;
  }

  private dropFromTrees() {
    if (this.ended || !this.level.trees.length) return;
    if (this.pickups.countActive() > 14) return;
    const t = Phaser.Utils.Array.GetRandom(this.level.trees);
    const cam = this.cameras.main;
    const x = t.x * TILE + 8;
    if (x < cam.scrollX - 20 || x > cam.scrollX + GAME_W + 20) return;
    const a = this.spawnPickup(x, t.y * TILE - 4, true);
    (a.body as Phaser.Physics.Arcade.Body).setVelocity(Phaser.Math.Between(-20, 20), 20);
    sfx.drop();
  }

  private maybeSpawnBoss() {
    if (this.bossSpawned) return;
    const lead = Math.max(...this.heroes.filter((h) => h.alive).map((h) => h.x), 0);
    if (lead < this.level.boss.x * TILE - 70) return;
    this.bossSpawned = true;
    this.camLock = true;
    sfx.boss();
    const b = this.level.boss;
    this.boss = new Foe(this, b.x * TILE, b.y * TILE, b.kind, b.hp, { boss: true, speed: 42 });
    this.boss.stunUntil = this.time.now + 900;
    this.foes.add(this.boss);
    const label = pixelText(this, GAME_W / 2, 36, b.name, {
      scale: 2,
      color: 0xff8080,
      originX: 0.5,
      stroke: true,
      scrollFactor: 0,
    });
    this.tweens.add({
      targets: label,
      alpha: 0,
      delay: 1600,
      duration: 400,
      onComplete: () => label.destroy(),
    });
    this.cameras.main.flash(180, 255, 80, 80);
  }

  private onBossDown() {
    if (this.ended) return;
    this.ended = true;
    sfx.win();
    const carry: Carry = {
      apples: this.heroes.map((h) => h.apples),
      lives: this.heroes.map((h) => Math.max(1, h.lives)),
      score: this.heroes.map((h) => h.score),
    };
    this.registry.set("carry", carry);
    this.registry.set("lastScores", this.heroes.map((h) => h.score));
    this.time.delayedCall(900, () => {
      const idx = (this.registry.get("level") as number) ?? 0;
      if (idx >= LEVELS.length - 1) this.scene.start("victory");
      else this.scene.start("level-complete");
    });
  }

  private fail() {
    if (this.ended) return;
    this.ended = true;
    sfx.lose();
    this.registry.set(
      "lastScores",
      this.heroes.map((h) => h.score),
    );
    this.time.delayedCall(700, () => this.scene.start("gameover"));
  }

  update() {
    if (this.ended) return;
    pollKeyboard();
    this.heroes.forEach((h) => h.updateHero(this, this.shots, this.melee));

    const alive = this.heroes.filter((h) => h.alive);
    if (!alive.length) {
      this.fail();
      return;
    }

    alive.forEach((h) => {
      if (h.y > GAME_H + 10) h.hurt(this, true);
      if (h.x < 10) h.x = 10;
      if (h.x > this.worldW - 10) h.x = this.worldW - 10;
    });

    this.foes.getChildren().forEach((obj) => {
      const f = obj as Foe;
      if (!f.active) return;
      f.chase(this, this.heroes);
      if (f.y > GAME_H + 20) f.destroy();
    });

    this.maybeSpawnBoss();
    this.updateCamera(alive);
    this.refreshHud();
  }

  private updateCamera(alive: Hero[]) {
    const cam = this.cameras.main;
    if (this.camLock) {
      const lockX = this.level.boss.x * TILE - GAME_W * 0.55;
      cam.scrollX = Phaser.Math.Clamp(lockX, 0, this.worldW - GAME_W);
      alive.forEach((h) => {
        const minX = cam.scrollX + 12;
        const maxX = cam.scrollX + GAME_W - 12;
        if (h.x < minX) h.x = minX;
        if (h.x > maxX) h.x = maxX;
      });
      return;
    }
    const mid = alive.reduce((s, h) => s + h.x, 0) / alive.length;
    const target = Phaser.Math.Clamp(mid - GAME_W / 2, 0, this.worldW - GAME_W);
    cam.scrollX = Phaser.Math.Linear(cam.scrollX, target, 0.12);
    const minX = cam.scrollX + 8;
    const maxX = cam.scrollX + GAME_W - 8;
    alive.forEach((h) => {
      if (h.x < minX) h.x = minX;
      if (h.x > maxX) h.x = maxX;
    });
  }
}

function GROUND_TOP(level: LevelDef) {
  const g = level.platforms.find((p) => p.w > 10 && p.y >= 13);
  return g?.y ?? 14;
}
