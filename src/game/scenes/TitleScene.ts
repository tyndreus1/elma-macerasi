import Phaser from "phaser";
import { GAME_H, GAME_W } from "../constants";
import { pixelText } from "../font";
import { resumeAudio, sfx } from "../audio";
import { bindKeyboard, tryFullscreenAndLandscape } from "../input";
import { showTouch, setTwoPlayerTouch } from "../touch";

export class TitleScene extends Phaser.Scene {
  private mode: 1 | 2 = 1;
  private ready = false;
  private b1?: Phaser.GameObjects.Rectangle;
  private b2?: Phaser.GameObjects.Rectangle;

  constructor() {
    super("title");
  }

  create() {
    bindKeyboard();
    showTouch(false);
    this.ready = false;
    this.cameras.main.setBackgroundColor("#7ec8f8");

    this.add.image(0, 0, "sky-orman").setOrigin(0).setDisplaySize(GAME_W, GAME_H);
    this.add.tileSprite(0, 168, GAME_W, 48, "hill-light").setOrigin(0).setAlpha(0.9);
    this.add.tileSprite(0, 224, GAME_W, 16, "grass").setOrigin(0);
    for (let x = 0; x < GAME_W; x += 16) {
      this.add.image(x, 240, "dirt").setOrigin(0);
      this.add.image(x, 256, "dirt").setOrigin(0);
    }

    this.add.image(28, 224, "tree").setOrigin(0.5, 1);
    this.add.image(452, 224, "tree").setOrigin(0.5, 1);
    this.add.image(70, 224, "bush").setOrigin(0.5, 1);
    this.add.image(410, 224, "bush").setOrigin(0.5, 1);

    if (this.textures.exists("title-heroes")) {
      const poster = this.add.image(GAME_W / 2, 92, "title-heroes");
      poster.setDisplaySize(118, 118);
      const frame = this.add.graphics();
      frame.lineStyle(3, 0x1a1020, 1);
      frame.strokeRect(GAME_W / 2 - 61, 92 - 61, 122, 122);
    }

    this.add.sprite(78, 224, "dad", "0").setOrigin(0.5, 1).play("dad-idle");
    this.add.sprite(402, 224, "boy", "0").setOrigin(0.5, 1).play("boy-idle");

    pixelText(this, GAME_W / 2, 4, "ELMA MACERASI", {
      scale: 2,
      color: 0xfff6c8,
      originX: 0.5,
      stroke: true,
    });
    pixelText(this, 78, 228, "Murat", { scale: 1, color: 0x5b8cff, originX: 0.5, stroke: true });
    pixelText(this, 402, 228, "Ege", { scale: 1, color: 0xffb347, originX: 0.5, stroke: true });

    for (const [hx, hy, delay] of [
      [36, 48, 0],
      [444, 42, 180],
      [52, 88, 360],
      [428, 90, 260],
    ] as const) {
      const h = this.add.image(hx, hy, "heart");
      this.tweens.add({
        targets: h,
        y: hy - 7,
        duration: 900,
        yoyo: true,
        repeat: -1,
        delay,
        ease: "Sine.inOut",
      });
    }

    this.b1 = this.makeButton(GAME_W / 2 - 80, 162, "1 Oyuncu", () => this.pick(1)).bg;
    this.b2 = this.makeButton(GAME_W / 2 + 80, 162, "2 Oyuncu", () => this.pick(2)).bg;
    this.pick(1, true);

    const hazir = this.makeButton(GAME_W / 2, 190, "Hazır!", () => this.startGame(), 180, 0xe85a4a);
    this.tweens.add({
      targets: hazir.c,
      scaleX: 1.04,
      scaleY: 1.04,
      yoyo: true,
      duration: 500,
      repeat: -1,
      ease: "Sine.inOut",
    });

    pixelText(this, GAME_W / 2, 244, "P1 WASD+F   P2 Yon+K", {
      scale: 1,
      color: 0xfff0a0,
      originX: 0.5,
      stroke: true,
    });
    pixelText(this, GAME_W / 2, 256, "ENTER / Hazır", {
      scale: 1,
      color: 0xd0e8ff,
      originX: 0.5,
      stroke: true,
    });

    this.input.keyboard?.on("keydown-ONE", () => this.pick(1));
    this.input.keyboard?.on("keydown-DIGIT1", () => this.pick(1));
    this.input.keyboard?.on("keydown-TWO", () => this.pick(2));
    this.input.keyboard?.on("keydown-DIGIT2", () => this.pick(2));
    this.input.keyboard?.on("keydown-ENTER", () => this.startGame());
    this.input.keyboard?.on("keydown-SPACE", () => this.startGame());
  }

  private makeButton(x: number, y: number, label: string, fn: () => void, w = 140, fill = 0x2a2030) {
    const bg = this.add.rectangle(0, 0, w, 22, fill, 0.94).setStrokeStyle(2, 0xfff6c8);
    const t = pixelText(this, 0, 0, label, { scale: 1, color: 0xfff6c8, originX: 0.5, originY: 0.5 });
    const c = this.add.container(x, y, [bg, t]);
    c.setSize(w, 22);
    c.setInteractive({ useHandCursor: true });
    c.on("pointerdown", fn);
    return { c, bg };
  }

  private pick(mode: 1 | 2, silent = false) {
    this.mode = mode;
    if (!silent) sfx.ui();
    this.b1?.setFillStyle(mode === 1 ? 0x3d8a4a : 0x2a2030);
    this.b2?.setFillStyle(mode === 2 ? 0x3d8a4a : 0x2a2030);
  }

  private async startGame() {
    if (this.ready) return;
    this.ready = true;
    await resumeAudio();
    await tryFullscreenAndLandscape();
    sfx.start();
    const q = new URLSearchParams(typeof location !== "undefined" ? location.search : "");
    if (q.get("p") === "2") this.mode = 2;
    setTwoPlayerTouch(this.mode === 2);
    showTouch(true);
    this.registry.set("players", this.mode);
    const qLevel = Number(q.get("level") ?? "0");
    this.registry.set("level", Number.isFinite(qLevel) ? Phaser.Math.Clamp(qLevel, 0, 2) : 0);
    this.registry.set("startAtBoss", q.get("boss") === "1");
    this.registry.set("carry", null);
    this.cameras.main.flash(200, 255, 246, 200);
    this.time.delayedCall(220, () => this.scene.start("play"));
  }
}
