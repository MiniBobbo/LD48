import { Entity } from "../../entities/Entity";
import { Ghost } from "../../entities/Ghost";
import { GameScene } from "../../scenes/GameScene";
import { IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class GhostAngryChaseFSM extends FSMModule {
    e:Ghost;
    chaseAccel:number = 30;
    chaseMaxSpeed:number = 100;
    constructor(parent:IFSM) {
        super(parent);
        this.e = parent as Ghost;
    }

    moduleStart() {
        this.e.PlayAnimation('angry');
    }

    update(dt:number) {
        this.e.gs.physics.accelerateToObject(this.e.sprite, this.e.gs.player.sprite, this.chaseAccel, this.chaseMaxSpeed, this.chaseMaxSpeed );
        if(this.e.sprite.body.velocity.x < 0)
            this.e.sprite.flipX = true;
        else    
            this.e.sprite.flipX = false;

    }

    moduleEnd() {
    }
}