import { Entity } from "./Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { PlayerGround } from "../FSM/PlayerGround";
import { PlayerAir } from "../FSM/PlayerAir";
import { PlayerAttack } from "../FSM/PlayerAttack";
import { PlayerGoToGround } from "../FSM/PlayerGoToGround";

export class Player extends Entity {
    holdingLight:boolean = true;
    light:Phaser.GameObjects.Light;
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        this.hp = 5;
        this.maxhp = 5;
        this.flashTime = 1000;
        this.gs.collideMap.push(this.sprite);
        this.sprite.setSize(9,9);
        this.sprite.name = 'player';
        this.sprite.setGravityY(C.GRAVITY);
        this.sprite.setDepth(101);
        this.PlayAnimation('run');
        this.fsm.addModule('ground', new PlayerGround(this));
        this.fsm.addModule('air', new PlayerAir(this));
        this.fsm.addModule('attack', new PlayerAttack(this));
        this.fsm.addModule('gotoground', new PlayerGoToGround(this));
        this.fsm.changeModule('air');

        this.light = scene.lights.addLight(0,0,18, 0xffffff,2);
        
        this.sprite.on('flamereset', this.FlameReset, this);
    }

    FlameReset(arg0: string, FlameReset: any, arg2: this) {
        this.gs.flame.thrown = false;
        this.gs.events.emit('flameon');
        this.holdingLight = true;

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

    dispose() {
        this.sprite.removeListener('flamereset', this.FlameReset, this);

    }


}