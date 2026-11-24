import Phaser from "phaser";
import { createAllTextures } from "../sprites";
import { ensureBossWalkAnims } from "../bossWalk";
import { TITLE_HEROES_DATA_URL } from "../titleHeroesUrl";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload() {
    this.load.image("title-heroes", TITLE_HEROES_DATA_URL);
  }

  create() {
    createAllTextures(this);
    ensureBossWalkAnims(this);
    this.scene.start("title");
  }
}
