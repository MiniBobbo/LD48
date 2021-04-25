import { GhostAngryChaseFSM } from "../FSM/Ghosts/GhostAngryChaseFSM";
import { GhostAngryWaitFSM } from "../FSM/Ghosts/GhostAngryWaitFSM";
import { GhostWaitFSM } from "../FSM/Ghosts/GhostWaitFSM";
import { GhostWanderFSM } from "../FSM/Ghosts/GhostWanderFSM";
import { IH } from "../IH/IH";
import { Entity } from "./Entity";

export class Ghost extends Entity {
    constructor(scene:Phaser.Scene, ih:IH) {
        super(scene, ih);
        this.sprite.setSize(10,10).setPipeline('Light2D');
        this.sprite.name = 'ghost';
        this.sprite.setDepth(155).setAlpha(.4);
        this.PlayAnimation('float');
        this.sprite.setDrag(100,100);
        this.sprite.setMaxVelocity(10,10);
    
        this.fsm.addModule('wait', new GhostWaitFSM(this));
        this.fsm.addModule('wander', new GhostWanderFSM(this));
        this.fsm.addModule('angrywait', new GhostAngryWaitFSM(this));
        this.fsm.addModule('chase', new GhostAngryChaseFSM(this));
        this.fsm.changeModule('wait');

    }

    CollideMap() {
        this.gs.collideMap.push(this.sprite);
    }
    

}