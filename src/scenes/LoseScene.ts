export class LoseScene extends Phaser.Scene {
    // lose:Phaser.GameObjects.Sprite;
    
    create() {
        let lose = this.add.text(100,-100, 'Lose');
        // this.lose = this.add.sprite(133, -100, 'atlas', 'WinThing');
        this.time.delayedCall(300, () => {this.scene.stop('game');});
        this.tweens.add( {
            targets:[lose],
            duration:1000,
            y: 100,
            onComplete: () => {
                this.scene.start('game');
            }
        });

    }
}