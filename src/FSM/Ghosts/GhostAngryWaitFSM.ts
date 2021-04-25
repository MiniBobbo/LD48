import { Entity } from "../../entities/Entity";
import { Ghost } from "../../entities/Ghost";
import { GameScene } from "../../scenes/GameScene";
import { IFSM } from "../FSM";
import { FSMModule } from "../FSMModule";

export class GhostAngryWaitFSM extends FSMModule {
    e:Ghost;
    waitTime:number = 0;
    minWait:number = 1000;
    maxWaitTime:number = 4000;
    constructor(parent:IFSM) {
        super(parent);
        this.e = parent as Ghost;
    }

    moduleStart() {
        this.e.PlayAnimation('angry');
        this.e.gs.events.once('startlevel', () => {this.e.changeFSM('chase');});
    }

    update(dt:number) {
    
    }

    moduleEnd() {
        this.e.gs.events.removeListener('startlevel');
    }
}