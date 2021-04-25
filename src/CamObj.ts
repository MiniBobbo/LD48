import { GameScene } from "./scenes/GameScene";

export class CamObj {
    image:Phaser.GameObjects.Image;

    constructor(gs:GameScene) {
        this.image = gs.add.image(100, 100, 'atlas', 'particles_0').setPipeline('Light2D').setDepth(400).setVisible(false);
    }
}