import * as Phaser from "phaser";
import { Preload } from "./scenes/Preload";
import { C } from "./C";
import { GameData } from "./GameData";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { TestScene } from "./scenes/TestScene";
import { GameScene } from "./scenes/GameScene";
import { WinScene } from "./scenes/WinScene";
import { LoseScene } from "./scenes/LoseScene";
import { RestartScene } from "./scenes/RestartScene";


class Main extends Phaser.Game {
  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 266,
      height: 200,
      zoom:3,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true
        }
      },
      // scene:{
      //   // preload:preload,
      //   // game:Game
      // },
      render: {
        pixelArt:true,
      },
    };
    super(config);

    // this.scene.add("boot", Boot, false);
    this.scene.add("win", WinScene, false);
    this.scene.add("lose", LoseScene, false);
    this.scene.add("restart", RestartScene, false);
    this.scene.add("preload", Preload, false);
    this.scene.add("game", GameScene, false);
    this.scene.add("test", TestScene, false);
    this.scene.add("menu", MainMenuScene, false);
    this.scene.start("preload");
    // C.gd = new GameData();
    // C.setFlag('5', true);
    }

}

window.onload = () => {
  const GameApp: Phaser.Game = new Main();
};