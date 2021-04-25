import { Entity } from "../../entities/Entity";
import { Ghost } from "../../entities/Ghost";
import { GameScene } from "../../scenes/GameScene";
import { IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class GhostWaitFSM extends FSMModule {
    e:Ghost;
    waitTime:number = 0;
    minWait:number = 1000;
    maxWaitTime:number = 4000;
    constructor(parent:IFSM) {
        super(parent);
        this.e = parent as Ghost;
    }

    moduleStart() {
        console.log('Ghost waiting.');
        this.waitTime = Phaser.Math.Between(this.minWait, this.maxWaitTime);
        this.e.PlayAnimation('float');
        this.e.sprite.setAcceleration(0,0);
    }

    update(dt:number) {
        this.waitTime -= dt;
        if(this.waitTime < 0)
            this.parent.changeFSM('wander');
    }
}