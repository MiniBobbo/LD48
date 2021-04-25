import { Entity } from "../../entities/Entity";
import { Ghost } from "../../entities/Ghost";
import { GameScene } from "../../scenes/GameScene";
import { IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class GhostWanderFSM extends FSMModule {
    e:Ghost;
    waitTime:number = 0;
    minWander:number = 1000;
    maxWander:number = 4000;
    wanderAccel:number = 300;
    constructor(parent:IFSM) {
        super(parent);
        this.e = parent as Ghost;
    }

    moduleStart() {
        console.log('Ghost wandering.');
        this.waitTime = Phaser.Math.Between(this.minWander, this.maxWander);
        this.e.PlayAnimation('float');
        let accelx = Phaser.Math.Between(-this.wanderAccel, this.wanderAccel);
        this.e.sprite.setAcceleration(accelx, Phaser.Math.Between(-this.wanderAccel, this.wanderAccel));
        if(accelx > 0)
        this.e.sprite.flipX = false;
        else if(accelx < 0)
        this.e.sprite.flipX = true;
    }

    update(dt:number) {
        this.waitTime -= dt;
        if(this.waitTime < 0) {
            this.parent.changeFSM('wait');

        }
    }
}