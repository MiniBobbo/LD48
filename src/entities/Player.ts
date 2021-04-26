import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { PlayerGround } from "../FSM/PlayerGround";
import { PlayerAir } from "../FSM/PlayerAir";
import { PlayerGoToGround } from "../FSM/PlayerGoToGround";
import { PlayerThrow } from "../FSM/PlayerThrow";
import { SOUND } from "../Sounds";

export class Player extends Entity {
    holdingLight:boolean = false;
    light:Phaser.GameObjects.Light;
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(9,10);
        this.sprite.name = 'player';
        this.sprite.setGravityY(C.GRAVITY);
        this.sprite.setDepth(150);
        this.PlayAnimation('run');
        this.fsm.addModule('throw', new PlayerThrow(this));
        this.fsm.addModule('ground', new PlayerGround(this));
        this.fsm.addModule('air', new PlayerAir(this));
        // this.fsm.addModule('attack', new PlayerAttack(this));
        this.fsm.addModule('gotoground', new PlayerGoToGround(this));
        this.fsm.changeModule('air');

        this.light = scene.lights.addLight(0,0,18, 0xffffff,2);
        
        this.sprite.on('throw', this.TryThrow, this);
        this.sprite.on('dead', this.TryThrow, this);
    }

    Dead() {
        
    }

    TryThrow() {
        if(this.holdingLight) {
            this.ThrowLight();
        } else {
            this.FlameReset();
        }
    }

    FlameReset() {
        this.gs.flame.thrown = false;
        this.gs.events.emit('flameon');
        this.holdingLight = true;
        this.gs.flame.collision.setPosition(-1000,-1000).setGravityY(0).setVelocity(0,0);

    }

    Update(time:number, dt:number) {
        this.light.setPosition(this.sprite.x, this.sprite.y);
        super.Update(time, dt);
        if(this.holdingLight) {
            let xoffset = 7;
            if(this.sprite.flipX)
            xoffset *= -1;
            this.gs.flame.SetPosition(this.sprite.x + xoffset, this.sprite.y + -3);
        }
    }

    ThrowLight() {
        this.changeFSM('throw');
        this.gs.events.emit('sound', SOUND.THROW);

        this.gs.flame.thrown = true;
        this.holdingLight = false;
        this.gs.flame.collision.setPosition(this.gs.flame.light.x, this.sprite.y);
        let throwstr:{x:number, y:number} = {x:0, y:0};
        if(this.ih.IsPressed('up')) {
            throwstr.x = C.PLAYER_THROW_UP.x;
            throwstr.y = C.PLAYER_THROW_UP.y;
        } else if (this.ih.IsPressed('down')) {
            throwstr.x = C.PLAYER_THROW_DOWN.x;
            throwstr.y = C.PLAYER_THROW_DOWN.y;
        } else {
            throwstr.x = C.PLAYER_THROW_X;
            throwstr.y = C.PLAYER_THROW_Y;
        }
        if(this.sprite.flipX) {
            throwstr.x *= -1;
        }
        this.gs.flame.collision.setVelocity(throwstr.x, throwstr.y);
        this.gs.flame.collision.setGravityY(C.GRAVITY/5);
        


    }

    dispose() {
        console.log('Player Disposed');
        if(this.sprite != null)
            this.sprite.removeListener('flamereset', this.FlameReset, this);
        // this.sprite.destroy();
        super.dispose();

    }

    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        let combinedAnim = `${this.sprite.name}_${anim}`;
        if(this.holdingLight)
            combinedAnim += '_hold';
        if(ignoreIfPlaying && combinedAnim == this.lastAnim)
            return;
        this.sprite.anims.play(combinedAnim, ignoreIfPlaying);
        this.sprite.setOffset(this.sprite.width/2 - this.sprite.body.width/2, this.sprite.height/2- this.sprite.body.height/2);
        this.lastAnim = combinedAnim;
    }



}