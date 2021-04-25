import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { PlayerGround } from "../FSM/PlayerGround";
import { PlayerAir } from "../FSM/PlayerAir";
import { PlayerGoToGround } from "../FSM/PlayerGoToGround";

export class Player extends Entity {
    holdingLight:boolean = false;
    light:Phaser.GameObjects.Light;
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        this.hp = 5;
        this.maxhp = 5;
        this.flashTime = 1000;
        this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(10,10);
        this.sprite.name = 'player';
        this.sprite.setGravityY(C.GRAVITY);
        this.sprite.setDepth(150);
        this.PlayAnimation('run');
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
        this.gs.flame.thrown = true;
        this.holdingLight = false;
        this.gs.flame.collision.setPosition(this.gs.flame.light.x, this.sprite.y);
        let spdx = this.sprite.flipX ? C.PLAYER_THROW_X * -1 :C.PLAYER_THROW_X; 
        this.gs.flame.collision.setVelocity(spdx, C.PLAYER_THROW_Y);
        this.gs.flame.collision.setGravityY(C.GRAVITY/5);
        


    }

    dispose() {
        console.log('Player Disposed');
        this.sprite.removeListener('flamereset', this.FlameReset, this);
        // this.sprite.destroy();
        super.dispose();

    }


}