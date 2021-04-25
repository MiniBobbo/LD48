import { IH } from "../IH/IH";

export class LoseScene extends Phaser.Scene {
    win:Phaser.GameObjects.Sprite;
    bg:Phaser.GameObjects.TileSprite;
    ih:IH;
    tilemove:number;
    buttons:Phaser.GameObjects.Container;
    create() {

        this.tilemove = -15;
        this.ih = new IH(this);
        this.events.emit('holdinput');

        this.lights.enable();
        this.lights.setAmbientColor(0xffffff);
        this.lights.addLight(0,0, 100, 0xffffff, 1);
        
        let menu = this.CreateButton('Menu', 0).setPosition(0,-40).setDepth(20);
        let replay = this.CreateButton('Replay', 90).setPosition(60,0).setDepth(20);
        let replay2 = this.CreateButton('Replay', -90).setPosition(-60,0).setDepth(20);
        let next = this.CreateButton('Next', 180).setPosition(0,0).setDepth(20).setVisible(false);
        this.buttons = this.add.container(133,300,[menu, replay2, replay, next]).setDepth(100);

        this.bg = this.add.tileSprite(0,0,266,200, 'atlas', 'swishbg_0').setAlpha(0).setOrigin(0,0);
        this.win = this.add.sprite(133, -100, 'atlas', 'WinThing_1');
        this.tweens.add( {
            targets:[this.win],
            duration:500,
            ease:'Quad.easeInOut',

            y: 50,
            onComplete: () => {
            }
        });
        this.tweens.add( {
            targets:[this.buttons],
            duration:500,
            delay:500,
            ease:'Quad.easeInOut',

            y: 170,
            onComplete: () => {
                this.events.emit('resumeinput');
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

        this.events.on('pointermove', () => {replay.setPosition()});
        
    }

    CreateButton(text:string, arrowRotation:number) : Phaser.GameObjects.Container 
    {
        let replay = this.add.container();
        let b = this.add.image(0,0,'atlas', 'button2_0');
        replay.add(b);
        let a = this.add.image(0,5,'atlas', 'arrow').setAngle(arrowRotation);
        replay.add(a);
        let t = this.add.bitmapText(-10, -15, '8px', text).setCenterAlign();
        replay.add(t);
        return replay;
    } 

    ReplayLevel() {
        this.events.emit('holdinput');
        this.tweens.add( {
            targets:[this],
            duration:500,
            tilemove:15,
            // ease:'Quad.easeIn',
            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });

        this.tweens.add( {
            targets:[this.buttons, this.win],
            duration:500,
            delay:350,
            y:-1000,
            ease:'Quad.easeIn',

            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });

        this.time.delayedCall(1200, () => {
            this.tweens.add( {
                targets:[this.bg],
                duration:200,
                alpha:1,
                onComplete: () => {
                    this.scene.start('game');
                }
            });
    
        });


    }



    MainMenu() {

    }

    update() {
        this.bg.tilePositionY += this.tilemove;
        this.ih.update();
        if(this.ih.IsJustPressed('left') || this.ih.IsJustPressed('right') ) {
            this.ReplayLevel();
        }
    }}