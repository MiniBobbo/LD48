import Phaser from "phaser";
import { C } from "../C";
import { GameData } from "../GameData";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;
    buttons:Phaser.GameObjects.Group;

    create() {

        C.LoadGameData();
        this.buttons = this.add.group().setOrigin(0,0);

        for(let i = 1; i <= C.MAX_LEVEL; i++) {
            this.buttons.add(this.CreateButton(i));
        }

        Phaser.Actions.GridAlign(this.buttons.getChildren(), {
            width:2,
            x:130,
            y:75,
            cellWidth: 52,
            cellHeight:42
        } );

        this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);



        
        // this.StartButton = this.CreateButton('Level 1', 'Level_0', this.StartGame).setPosition(30,50);
        // this.EraseButton = this.CreateButton('Erase Saved Data', 'Erase', this.EraseSaves).setPosition(200,200);
        let eb = this.add.bitmapText(2,2, '8px', 'Erase Data').setInteractive().setTint(0x555555);
        eb.on('pointerdown', () => {
            console.log('Erasing Data');
            C.gd = new GameData();
            C.SaveGameData();
            this.scene.restart();
        }, this);

        this.lights.enable();
        this.lights.setAmbientColor(0xf0f0f0);

        let l = this.lights.addLight(0,0, 100, 0xffffff, 1);
        this.input.on('pointermove',  (pointer)=> {
            l.x = pointer.x;
            l.y = pointer.y;
        }, this);

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
        let b = this.add.image(0,0,'atlas', 'button2_0');
        replay.add(b);
        let message = `Sublevel \n${num}\n`;
        if(C.gd.times[num] != 0)
            message += `${C.gd.times[num].toFixed(2)} sec.`;
        let t = this.add.bitmapText(-18, -18, '8px', message).setCenterAlign();
        replay.add(t);
        b.setInteractive();
        b.on('pointerdown', () => {C.currentLevelNum = num; this.StartGame();});
        return replay;
    }
}