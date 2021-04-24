import { GameScene } from "./GameScene";

export class RestartScene extends Phaser.Scene {
    create() {
        // this.scene.stop('game');
        // this.scene.remove('game');
        this.time.delayedCall(1000, ()=> {
            console.log('Restarted Scene');
            // this.scene.add('game', GameScene);
            this.scene.start('game');

        });
    }

    update() {
    }
}