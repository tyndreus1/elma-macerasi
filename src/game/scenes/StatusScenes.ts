import Phaser from "phaser";
import { GAME_H, GAME_W, PLAYER_META } from "../constants";
import { LEVELS } from "../levels";
import { pixelText } from "../font";
import { sfx } from "../audio";
import { showTouch } from "../touch";

class MenuScene extends Phaser.Scene {
  protected drawBg(sky: string, hill: string) {
    this.add.tileSprite(0, 0, GAME_W, GAME_H, sky).setOrigin(0);
    this.add.tileSprite(0, 170, GAME_W, 48, hill).setOrigin(0);
    this.add.tileSprite(0, 224, GAME_W, 48, "grass").setOrigin(0);
  }

  protected btn(x: number, y: number, label: string, fn: () => void) {
    const bg = this.add.rectangle(0, 0, 160, 24, 0x2a2030, 0.92).setStrokeStyle(2, 0xfff6c8);
    const t = pixelText(this, 0, 0, label, { scale: 1, color: 0xfff6c8, originX: 0.5, originY: 0.5 });
    const c = this.add.container(x, y, [bg, t]);
    c.setSize(160, 24);
    c.setInteractive({ useHandCursor: true });
    c.on("pointerdown", fn);
    return c;
  }

  protected scores() {
    const scores = (this.registry.get("lastScores") as number[] | undefined) ?? [];
    scores.forEach((s, i) => {
      pixelText(this, GAME_W / 2, 118 + i * 16, `${PLAYER_META[i].name}: ${s}`, {
        scale: 1,
        color: PLAYER_META[i].tint,
        originX: 0.5,
        stroke: true,
      });
    });
  }
}

export class LevelCompleteScene extends MenuScene {
  constructor() {
    super("level-complete");
  }

  create() {
    showTouch(false);
    const idx = (this.registry.get("level") as number) ?? 0;
    const level = LEVELS[idx];
    this.drawBg(level.sky, level.hill);
    this.add.sprite(200, 210, "dad", "0").play("dad-idle").setOrigin(0.5, 1);
    this.add.sprite(280, 210, "boy", "0").play("boy-idle").setOrigin(0.5, 1);
    this.add.image(GAME_W / 2, 90, "apple").setScale(2);
    pixelText(this, GAME_W / 2, 24, "SEVİYE TAMAMLANDI", {
      scale: 2,
      color: 0xfff6c8,
      originX: 0.5,
      stroke: true,
    });
    pixelText(this, GAME_W / 2, 52, level.name, { scale: 1, color: 0xa0ffb0, originX: 0.5, stroke: true });
    this.scores();
    this.btn(GAME_W / 2, 200, "Devam", () => this.next());
    this.input.keyboard?.once("keydown-ENTER", () => this.next());
    this.input.keyboard?.once("keydown-SPACE", () => this.next());
  }

  private next() {
    sfx.start();
    this.registry.set("level", ((this.registry.get("level") as number) ?? 0) + 1);
    showTouch(true);
    this.scene.start("play");
  }
}

export class GameOverScene extends MenuScene {
  constructor() {
    super("gameover");
  }

  create() {
    showTouch(false);
    this.drawBg("sky-kale", "hill-castle");
    pixelText(this, GAME_W / 2, 28, "OYUN BİTTİ", { scale: 2, color: 0xff8080, originX: 0.5, stroke: true });
    pixelText(this, GAME_W / 2, 56, "Canlar bitti... bir daha!", {
      scale: 1,
      color: 0xfff0c0,
      originX: 0.5,
      stroke: true,
    });
    this.scores();
    this.btn(GAME_W / 2, 188, "Tekrar Dene", () => this.retry());
    this.btn(GAME_W / 2, 218, "Menü", () => this.scene.start("title"));
    this.input.keyboard?.once("keydown-ENTER", () => this.retry());
  }

  private retry() {
    sfx.ui();
    this.registry.set("carry", null);
    showTouch(true);
    this.scene.start("play");
  }
}

export class VictoryScene extends MenuScene {
  constructor() {
    super("victory");
  }

  create() {
    showTouch(false);
    this.drawBg("sky-orman", "hill-light");
    this.add.sprite(170, 208, "dad", "0").play("dad-idle").setOrigin(0.5, 1);
    this.add.sprite(310, 208, "boy", "0").play("boy-idle").setOrigin(0.5, 1);
    this.add.image(240, 200, "heart");
    pixelText(this, GAME_W / 2, 20, "TEBRİKLER!", { scale: 2, color: 0xfff06a, originX: 0.5, stroke: true });
    const two = ((this.registry.get("players") as number) ?? 1) > 1;
    pixelText(this, GAME_W / 2, 48, two ? "Birlikte kazandınız!" : "Sen kazandın Murat!", {
      scale: 1,
      color: 0xfff6c8,
      originX: 0.5,
      stroke: true,
    });
    pixelText(this, GAME_W / 2, 68, "Ege ve Murat elma kahramanları", {
      scale: 1,
      color: 0xa0ffb0,
      originX: 0.5,
      stroke: true,
    });
    this.scores();
    this.btn(GAME_W / 2, 210, "Menü", () => this.scene.start("title"));
    this.input.keyboard?.once("keydown-ENTER", () => this.scene.start("title"));
  }
}
