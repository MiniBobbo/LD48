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

    preload() {
        this.ih = new IH(this);
    }

    create() {
        this.endLocation = {x:0, y:0};
        let r = new LdtkReader(this,this.cache.json.get('levels'));
        this.events.emit('holdinput');
        this.maps = r.CreateMap(C.currentLevel, 'tileset');
        SetupMapHelper.SetupMap(this, this.maps);

        this.DisplayPlayer();

        this.events.once('playerwin', () => {this.PlayerWin();} );

        this.input.on('pointerdown', () => {

        })
    }

    PlayerWin() {
        console.log("Win");
        this.events.emit('holdinput');
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
    }

}