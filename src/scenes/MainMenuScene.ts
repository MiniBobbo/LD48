import Phaser from "phaser";
import { isIntersectionTypeNode } from "typescript";
import { C } from "../C";
import { GameData } from "../GameData";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;
    buttons:Phaser.GameObjects.Group;
    once:boolean = false;

    create() {

        C.LoadGameData();
        this.buttons = this.add.group().setOrigin(0,0);

        this.Init();

        for(let i = 1; i <= C.MAX_LEVEL; i++) {
            this.buttons.add(this.CreateButton(i));
        }

        Phaser.Actions.GridAlign(this.buttons.getChildren(), {
            width:3,
            x:100,
            y:120,
            cellWidth: 70,
            cellHeight:35
        } );

        let bg = this.add.image(0,35,'title').setOrigin(0,0).setPipeline('Light2D');
        let guy = this.add.image(194, 24 + 35, 'atlas', 'guy_stand_0').setFlipX(true);

        let title = this.add.bitmapText(5,5, '8px', 'Deeper and Deeper').setScale(2);
        let subtitle = this.add.bitmapText(5,35, '8px', 'LD48 Compo entry\nBy Minibobbo');
        var shape1 = new Phaser.Geom.Circle(0, 0, 3);
        var shape2 = new Phaser.Geom.Circle(0, 0, 2);

        let p = this.add.particles('atlas').setPipeline('Light2D').setDepth(151);


        let e = p.createEmitter({
            frame:'particles_1',
            radial:false,
            quantity: 1,
            lifespan: 1000,
            //@ts-ignore
            emitZone:{ type: 'random', source: shape1 },
            gravityY:-80,
            scale: { start: 1, end: 0, ease: 'Power3' },
            // blendMode: 'ADD'
        });
        let e2 = p.createEmitter({
            frame:'particles_0',
            radial:false,
            quantity: 1,
            lifespan: 1000,
            //@ts-ignore
            emitZone:{ type: 'random', source: shape2 },
            gravityY:-80,
            scale: { start: 1, end: 0, ease: 'Power3' },
            blendMode: 'ADD'
        });

        this.lights.enable();
        this.lights.setAmbientColor(0xf0f0f0);
        let l = this.lights.addLight(0,0, 150, 0xffffff, 1);
        l.setPosition(186,21 + 35);
        e.setPosition(186,21 + 35);
        e2.setPosition(186,21 + 35);
        e.start();
        e2.start();
        l.setVisible(true);


        
        // this.StartButton = this.CreateButton('Level 1', 'Level_0', this.StartGame).setPosition(30,50);
        // this.EraseButton = this.CreateButton('Erase Saved Data', 'Erase', this.EraseSaves).setPosition(200,200);
        // let eb = this.add.bitmapText(200,2, '8px', 'Erase Game Data').setInteractive().setTint(0x555555).setScale(.5);
        // eb.on('pointerdown', () => {
        //     console.log('Erasing Data');
        //     C.gd = new GameData();
        //     C.SaveGameData();
        //     this.scene.restart();
        // }, this);


        // this.input.on('pointermove',  (pointer)=> {
        //     l.x = pointer.x;
        //     l.y = pointer.y;
        // }, this);

    }
    Init() {
        if(!this.once) {
            let s = this.sound.add('mystery');
            s.play('', {loop:true});
            this.once = true;
        }
    }

    StartGame() {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ this.scene.start('game');})
    }

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Erase Saved Data Button Pressed');
        C.gd = new GameData();
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
        this.scene.restart();
    }

    update(time:number, dt:number) {

    }

    CreateButton(num:number):Phaser.GameObjects.Container {
        let replay = this.add.container();
        let b = this.add.image(0,0,'button');
        replay.add(b);
        let message = `Sublevel ${num}\n`;
        // if(C.gd.times[num] != 0)
        //     message += `${C.gd.times[num].toFixed(2)} sec.`;
        let t = this.add.bitmapText(-20, -7, '8px', message);
        replay.add(t);
        b.setInteractive();
        b.on('pointerdown', () => {C.currentLevelNum = num; this.StartGame();});
        replay.setDepth(100);
        return replay;
    }
}