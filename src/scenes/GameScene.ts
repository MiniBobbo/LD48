import { Game } from "phaser";
import { C } from "../C";
import { CamObj } from "../CamObj";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { Flame } from "../Flame";
import { SetupMapHelper } from "../helpers/SetupMapHelper";
import { IH } from "../IH/IH";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { SOUND, Sounds } from "../Sounds";
import { BaseAttack } from "./attacks/BaseAttack";

export class GameScene extends Phaser.Scene {
    collideMap!:Array<Phaser.GameObjects.GameObject>;
    player:Player;
    flame:Flame;
    maps!:LDtkMapPack;
    ih!:IH;
    endLocation:{x:number, y:number};
    firstBoot:boolean = true;
    gs:GameState = GameState.START;
    winThing:Phaser.GameObjects.Sprite;
    elapsedTime:number = 0;
    elapsedTimeLabel:Phaser.GameObjects.BitmapText;
    deathZones:Array<Phaser.GameObjects.Zone>;
    extinguishZones:Array<Phaser.GameObjects.Zone>;
    soakZones:Array<Phaser.GameObjects.Zone>;
    cam:CamObj;
    dangerSprites:Array<Phaser.Physics.Arcade.Sprite>;
    entities:Array<Entity>;
    attacks:Array<BaseAttack>;
    s:Sounds;

    preload() {
        this.ih = new IH(this);
    }

    create() {
        console.log('GameScene Created.');
        if(this.firstBoot) {
            this.init();
        }

        this.FlashText();
        

        this.deathZones = [];
        this.extinguishZones = [];
        this.soakZones = [];
        this.dangerSprites = [];
        this.entities = [];

        this.cam = new CamObj(this);
        this.cameras.main.startFollow(this.cam.image);
        this.cam.image

        this.elapsedTime = 0;
        this.elapsedTimeLabel = this.add.bitmapText(1,1,'8px', '').setScrollFactor(0,0).setDepth(300).setVisible(false);
        this.gs = GameState.START;
        this.endLocation = {x:0, y:0};
        let r = new LdtkReader(this,this.cache.json.get('levels'));
        this.events.emit('holdinput');
        this.maps = r.CreateMap(C.getCurrentLevelName(), 'tileset');
        SetupMapHelper.SetupMap(this, this.maps);
        

        this.DisplayPlayer();

        this.events.once('playerwin', () => {this.PlayerWin();} );
        this.events.once('playerdead', () => {this.PlayerLose();} );

        this.events.on('sound', (sound:SOUND)=> {this.s.PlaySound(sound);}, this);

        this.input.on('pointerdown', () => {

        });

    }
    FlashText() {
        let levelname = `Sublevel ${C.currentLevelNum}`;
        let text = this.add.bitmapText(10,10, '8px', levelname).setScale(2).setScrollFactor(0).setAlpha(0).setDepth(300);
        this.tweens.add( {
            targets:[text],
            duration:800,
            alpha:1,
            onComplete: () => {
            }
        });


        this.time.delayedCall(4000, () => {
            this.tweens.add( {
                targets:[text],
                duration:800,
                alpha:0,
                onComplete: () => {
                }
            });
    
        });

    }

    init() {
        this.firstBoot = false;
        this.attacks = [];
        this.events.on('destroy', () => {console.log('Game Scene Destroyed.');});
        this.events.on('shutdown', () => {console.log('Game Scene shut down.');  this.Shutdown()});

        this.s = new Sounds(this);
    }

    PlayerLose() {
        console.log("Lose");
        this.s.PlaySound(SOUND.DEAD);
        this.gs = GameState.LOSE;
        this.events.emit('holdinput');
        this.flame.FlameOff();
        this.player.changeFSM('gotoground');
        this.player.sprite.disableBody(false);
        // this.player.sprite.setPosition(this.endLocation.x, this.endLocation.y);
        this.player.PlayAnimation('dead');
        // this.time.delayedCall(1000, () => {
        //     console.log('Restarting game scene');
        //     this.scene.start('restart')});
        // this.scene.launch('lose').moveAbove('game', 'lose');
        this.tweens.add({
            delay:1500,
            targets:[this.cam.image],
            x:this.player.sprite.x,
            y:-2000,
            duration:1500,
            ease:'Sine.easeInOut',

        });

        this.time.delayedCall(2000, () => {this.scene.start('lose');});



    }

    Shutdown() {
        this.attacks.forEach(element => {
            element.Destroy();
        });
        this.attacks = [];
        this.flame.dispose();
        this.lights.destroy();
        if(this.player != null)
            this.player.dispose();
        this.time.clearPendingEvents();
        this.collideMap = [];
        this.maps.dispose();
        this.player = null;
        this.children.list.forEach(element => {
            element.destroy();
        });
        this.deathZones.forEach(element => {
            element.destroy();
        });
        this.deathZones = [];
        this.entities.forEach(element => {
            element.dispose();
        });
    }

    PlayerWin() {
        console.log("Win");
        C.lastCompleteTime = this.elapsedTime/1000;
        this.gs = GameState.WIN;
        this.events.emit('holdinput');
        this.flame.FlameOff();
        this.player.changeFSM('gotoground');
        this.player.sprite.disableBody(false);
        this.player.sprite.setPosition(this.endLocation.x, this.endLocation.y);
        this.tweens.add( {
            targets:[this.player.sprite],
            duration:1000,
            alpha:0,
            onComplete: () => {
                this.player.PlayAnimation('stand');
            }
        });

        this.tweens.add({
            delay:1500,
            targets:[this.cam.image],
            x:this.player.sprite.x,
            y:2000,
            duration:1500,
            ease:'Sine.easeInOut',

        });

        this.time.delayedCall(1800, () => {this.scene.start('win');});


    }

    DisplayPlayer() {
        this.tweens.add({
            targets:[this.cam.image],
            x:this.player.sprite.x,
            y:this.player.sprite.y,
            duration:2000,
            ease:'Quad.easeInOut'

        });

        this.player.sprite.alpha = 1;
        this.time.delayedCall(2200, () => {
            // this.player.PlayAnimation('stand');
            this.events.emit('resumeinput');
            this.gs = GameState.GAME;
            this.events.emit('startlevel');
        });
        // this.tweens.add( {
        //     targets:[this.player.sprite],
        //     duration:3000,
        //     alpha:1,
        //     onComplete: () => {
        //         this.player.PlayAnimation('stand');
        //         this.events.emit('resumeinput');
        //     }
        // });
    }

    update(time:number, dt:number) {
        if(this.gs == GameState.GAME && (!this.flame.currentlyOn || this.player.holdingLight))
            this.cam.image.setPosition(this.player.sprite.x, this.player.sprite.y);
        else if (this.gs == GameState.GAME)
            this.cam.image.setPosition((this.player.sprite.x + this.flame.collision.x) / 2, (this.player.sprite.y + this.flame.collision.y) / 2);

        if(this.gs == GameState.GAME) {
            this.elapsedTime += dt;
            this.elapsedTimeLabel.text = `${(this.elapsedTime/1000).toFixed(2)}`;
        }
        this.ih.update();
        if(this.ih.IsJustPressed('attack')) {
            this.player.sprite.emit('throw');

        }
        if(this.ih.IsJustPressed('throw')) {
            this.events.emit('playerdead');

        }
    }
    
    GetEnemyAttack():any {
        let a = this.attacks.find( (a:BaseAttack) => { return a.sprite.body.enable === false;})
        if(a===undefined) {
            a = new BaseAttack(this);
            this.attacks.push(a);
            this.dangerSprites.push(a.sprite);
        }
        return a;
    }


}

export enum GameState {
    GAME,
    WIN,
    LOSE,
    START
}