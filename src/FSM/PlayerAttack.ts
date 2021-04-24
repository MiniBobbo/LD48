import { FSMModule } from "./FSMModule";
import { Entity } from "../entities/Entity";
import { IH } from "../IH/IH";
import { C } from "../C";

export class PlayerAttack extends FSMModule {
    e!:Entity;
    ih!:IH;
    
    moduleStart() {
        this.e = this.parent as Entity;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_SPEED, C.MAX_Y_SPEED);
        this.e.sprite.setDragX(this.e.sprite.body.blocked.down ? C.PLAYER_GROUND_DRAG: 0);
        // this.e.PlayAnimation('swing');
        this.e.sprite.setAccelerationX(0);
        this.e.scene.time.addEvent({
            delay:C.PLAYER_ATTACK_TIME,
            callback:() => {this.e.changeFSM('ground');},
            callbackScope:this
        });

        let offset = 12;
        if(this.e.sprite.flipX)
            offset *= -1;
    }

    moduleEnd() {
    }

}