export class WinScene extends Phaser.Scene {
    win:Phaser.GameObjects.Sprite;
    
    create() {
        this.win = this.add.sprite(133, -100, 'atlas', 'WinThing');
        this.tweens.add( {
            targets:[this.win],
            duration:1000,
            y: 100,
            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });

    }
}