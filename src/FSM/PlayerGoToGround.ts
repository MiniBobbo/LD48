import { FSMModule } from "./FSMModule";
import { Entity } from "../entities/Entity";
import { IH } from "../IH/IH";
import { C } from "../C";

export class PlayerGoToGround extends FSMModule {
    e!:Entity;
    ih!:IH;
    FirstPass:boolean = false;
    DeltaJump:number = 0;
    lastFrameDown:boolean = false;
    stopChecking:boolean = false;
    moduleStart() {
        this.e = this.parent as Entity;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_AIR_SPEED, C.MAX_Y_SPEED);
        this.e.sprite.setDragX(C.PLAYER_AIR_DRAG);
        this.DeltaJump = 0;
        this.e.sprite.body.blocked.down = false;
        this.e.sprite.body.touching.down = false;
        this.FirstPass = true;
        this.e.sprite.setAccelerationX(0);
        this.stopChecking = false;
    }

    moduleEnd() {
    }

    update(dt:number) {
        
            if(this.e.sprite.body.blocked.down && !this.stopChecking) {
                // this.e.PlayAnimation('stand');
                this.stopChecking = true;
                // this.parent.changeFSM('nothing');
                return;
            } 
        if(!this.stopChecking)
            this.ChangeAnimation();
    }

    ChangeAnimation() {
        if(this.e.sprite.body.velocity.y < 0) {
            // this.e.PlayAnimation('jumpup');
        } else {
            // this.e.PlayAnimation('jumpdown');
        }

    }
}