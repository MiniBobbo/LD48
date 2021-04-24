import { C } from "../C";
import { Player } from "../entities/Player";
import { Flame } from "../Flame";
import { SetupMapHelper } from "../helpers/SetupMapHelper";
import { IH } from "../IH/IH";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";

export class GameScene extends Phaser.Scene {
    collideMap!:Array<Phaser.GameObjects.GameObject>;
    player:Player;
    flame:Flame;
    maps!:LDtkMapPack;
    ih!:IH;
    endLocation:{x:number, y:number};
    firstBoot:boolean = true;
    gs:GameState = GameState.GAME;
    winThing:Phaser.GameObjects.Sprite;
    

    preload() {
        this.ih = new IH(this);
    }

    create() {
        console.log('GameScene Created.');
        if(this.firstBoot) {
            this.init();
        }

        this.gs = GameState.GAME;
        this.endLocation = {x:0, y:0};
        let r = new LdtkReader(this,this.cache.json.get('levels'));
        this.events.emit('holdinput');
        this.maps = r.CreateMap(C.currentLevel, 'tileset');
        SetupMapHelper.SetupMap(this, this.maps);

        this.DisplayPlayer();

        this.events.once('playerwin', () => {this.PlayerWin();} );
        this.events.once('playerdead', () => {this.PlayerLose();} );

        this.input.on('pointerdown', () => {

        });

    }

    init() {
        this.firstBoot = false;
        this.events.on('destroy', () => {console.log('Game Scene Destroyed.');});
        this.events.on('shutdown', () => {console.log('Game Scene shut down.');  this.Shutdown()});
    }

    PlayerLose() {
        console.log("Lose");
        this.events.emit('holdinput');
        this.flame.FlameOff();
        this.player.changeFSM('gotoground');
        this.player.sprite.disableBody(false);
        // this.player.sprite.setPosition(this.endLocation.x, this.endLocation.y);
        this.player.PlayAnimation('dead');
        this.time.delayedCall(1000, () => {
            console.log('Restarting game scene');
            this.scene.start('restart')});
        

    }

    Shutdown() {
        this.flame.dispose();
        this.lights.destroy();
        this.player.dispose();
        this.time.clearPendingEvents();
        this.collideMap = [];
        this.maps.dispose();
        this.player = null;
        this.children.list.forEach(element => {
            element.destroy();
        });
    }

    PlayerWin() {
        console.log("Win");
        this.events.emit('holdinput');
        this.flame.FlameOff();
        this.player.changeFSM('gotoground');
        this.player.sprite.disableBody(false);
        this.player.sprite.setPosition(this.endLocation.x, this.endLocation.y);
        this.player.PlayAnimation('walktowards');
        this.tweens.add( {
            targets:[this.player.sprite],
            duration:1000,
            alpha:0,
            onComplete: () => {
                this.player.PlayAnimation('stand');
                this.scene.launch('win').moveAbove('game', 'win');
            }
        });

    }

    DisplayPlayer() {
        this.player.PlayAnimation('walktowards');
        this.tweens.add( {
            targets:[this.player.sprite],
            duration:1000,
            alpha:1,
            onComplete: () => {
                this.player.PlayAnimation('stand');
                this.events.emit('resumeinput');
            }
        });
    }

    update(time:number, dt:number) {
        this.ih.update();
        if(this.ih.IsJustPressed('attack')) {
            this.player.sprite.emit('throw');

        }
        if(this.ih.IsJustPressed('throw')) {
            this.events.emit('playerdead');

        }
    }

}

enum GameState {
    GAME,
    WIN,
    LOSE
}