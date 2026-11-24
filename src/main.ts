import Phaser from "phaser";
import { GAME_H, GAME_W } from "./game/constants";
import { BootScene } from "./game/scenes/BootScene";
import { TitleScene } from "./game/scenes/TitleScene";
import { PlayScene } from "./game/scenes/PlayScene";
import { GameOverScene, LevelCompleteScene, VictoryScene } from "./game/scenes/StatusScenes";
import { bindKeyboard } from "./game/input";
import { bindTouchDom } from "./game/touch";

import "./style.css";

bindKeyboard();
bindTouchDom();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#7ec8f8",
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  width: GAME_W,
  height: GAME_H,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_W,
    height: GAME_H,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 980 },
      debug: false,
    },
  },
  input: {
    activePointers: 4,
    keyboard: true,
  },
  scene: [BootScene, TitleScene, PlayScene, LevelCompleteScene, GameOverScene, VictoryScene],
};

const game = new Phaser.Game(config);

function syncPortrait() {
  const portrait = window.matchMedia("(orientation: portrait)").matches && window.innerHeight > window.innerWidth;
  document.documentElement.classList.toggle("portrait", portrait);
}

syncPortrait();
window.addEventListener("resize", syncPortrait);
window.addEventListener("orientationchange", () => setTimeout(syncPortrait, 120));

window.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
});

void game;
