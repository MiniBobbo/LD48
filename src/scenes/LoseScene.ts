import { C } from "../C";
import { GameData } from "../GameData";
import { IH } from "../IH/IH";

export class LoseScene extends Phaser.Scene {
    win:Phaser.GameObjects.Container;
    bg:Phaser.GameObjects.TileSprite;
    ih:IH;
    tilemove:number;
    buttons:Phaser.GameObjects.Container;
    gd:GameData;

    create() {
        this.win = this.add.container().setDepth(300);
        let g = this.add.graphics();
        var color = 0x000000;
        var alpha = 0.0;
    
        g.fillStyle(color, alpha);
        g.fillRect(-115, 10, 230, 90);
        this.win.add(g);
        let winText = `Sublevel ${C.currentLevelNum} Failed\nGoing deeper...?\n`;
        if(C.gd.times[C.currentLevelNum] == 0 || C.lastCompleteTime < C.gd.times[C.currentLevelNum]) {
            // winText += '**New Record**';
            C.gd.times[C.currentLevelNum] = C.lastCompleteTime;
            localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
        } else {
            // winText += `Best Time: ${C.gd.times[C.currentLevelNum].toFixed(2)}`;
        }
        let winMessage = this.add.bitmapText(-75, 12, '8px', winText).setCenterAlign().setScale(2);
        this.win.add(winMessage);
        this.win.setPosition(133, -200);

        this.tilemove = 1;
        this.ih = new IH(this);
        this.events.emit('holdinput');

        this.lights.enable();
        this.lights.setAmbientColor(0x555555);
        this.lights.addLight(133,100, 100, 0xffffff, 1);
        
        let menu = this.CreateButton('Back to\nSurface', 0).setPosition(0,-44).setDepth(20);
        let replay = this.CreateButton('Replay', 90).setPosition(60,0).setDepth(20);
        let replay2 = this.CreateButton('Replay', -90).setPosition(-60,0).setDepth(20);
        let next = this.CreateButton('Go\nDeeper', 180).setPosition(0,0).setDepth(20);
        if(C.currentLevelNum == C.MAX_LEVEL)
            next.setVisible(false);
        this.buttons = this.add.container(133,300,[menu, replay2, replay, next]).setDepth(100);

        this.bg = this.add.tileSprite(0,0,266,200, 'bg').setAlpha(0).setOrigin(0,0).setPipeline('Light2D');
        // this.win = this.add.sprite(133, -100, 'atlas', 'WinThing');
        this.tweens.add( {
            targets:[this.win],
            duration:500,
            ease:'Quad.easeInOut',

            y: 4,
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
        let a = this.add.image(0,12,'atlas', 'arrow').setAngle(arrowRotation).setScale(.5);
        replay.add(a);
        let t = this.add.bitmapText(-15, -15, '8px', text).setCenterAlign();
        replay.add(t);
        return replay;
    } 

    ReplayLevel() {
        this.events.emit('holdinput');
        this.tweens.add( {
            targets:[this],
            duration:500,
            tilemove:-15,
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
            y:1000,
            // ease:'Quad.easeIn',

            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });

        this.time.delayedCall(1200, () => {
            this.tweens.add( {
                targets:[this.bg],
                duration:800,
                alpha:0,
                onComplete: () => {
                    this.scene.start('game');
                }
            });
    
        });


    }



    MainMenu() {
        this.events.emit('holdinput');

        this.tweens.add( {
            targets:[this.buttons, this.win],
            duration:1000,
            // delay:350,
            y:-1000,
            // ease:'Quad.easeIn',

            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });

        this.time.delayedCall(400, () => {
            this.tweens.add( {
                targets:[this.bg],
                duration:1000,
                alpha:0,
                onComplete: () => {
                    this.scene.start('menu');
                }
            });
    
        });
    }

    NextLevel() {
        this.events.emit('holdinput');
        this.tweens.add( {
            targets:[this.buttons, this.win],
            duration:1000,
            // delay:350,
            y:-1000,
            // ease:'Quad.easeIn',

            onComplete: () => {
                // this.player.PlayAnimation('stand');
                // this.scene.launch('win');
            }
        });

        this.time.delayedCall(400, () => {
            this.tweens.add( {
                targets:[this.bg],
                duration:1000,
                alpha:0,
                onComplete: () => {
                    C.currentLevelNum++;
                    this.scene.start('game');
                }
            });
    
        });

    }

    update() {
        this.bg.tilePositionY += this.tilemove;
        this.ih.update();
        if(this.ih.IsJustPressed('left') || this.ih.IsJustPressed('right') ) {
            this.ReplayLevel();
        }
        if(this.ih.IsJustPressed('up')) {
            this.MainMenu();
        }
        if( this.ih.IsJustPressed('down') && C.currentLevelNum != C.MAX_LEVEL )
            this.NextLevel();

    }}