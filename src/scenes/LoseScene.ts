export class LoseScene extends Phaser.Scene {
    win:Phaser.GameObjects.Sprite;
    bg:Phaser.GameObjects.TileSprite;

    create() {

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);
        this.lights.addLight(0,0, 100, 0xffffff, 1);

        this.bg = this.add.tileSprite(0,0,266,200, 'atlas', 'swishbg_0').setAlpha(0).setPipeline('Light2D').setOrigin(0,0);
        this.win = this.add.sprite(133, -100, 'atlas', 'WinThing_1').setPipeline('Light2D');
        this.tweens.add( {
            targets:[this.win],
            duration:1000,
            y: 100,
            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });
        this.tweens.add( {
            targets:[this.bg],
            duration:200,
            alpha:1,
            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });
        
    }

    update() {
        this.bg.tilePositionY -= 10;
    }}