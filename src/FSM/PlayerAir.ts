import { FSMModule } from "./FSMModule";
import { Entity } from "../entities/Entity";
import { IH } from "../IH/IH";
import { C } from "../C";
import { SOUND } from "../Sounds";

export class PlayerAir extends FSMModule {
    e!:Entity;
    ih!:IH;
    FirstPass:boolean = false;
    DeltaJump:number = 0;
    lastFrameDown:boolean = false;
    jumpingUp:boolean = false;
    moduleStart() {
        this.e = this.parent as Entity;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_AIR_SPEED, C.MAX_Y_SPEED);
        this.e.sprite.setDragX(C.PLAYER_AIR_DRAG);
        this.DeltaJump = 0;
        this.e.sprite.body.blocked.down = false;
        this.e.sprite.body.touching.down = false;
        this.FirstPass = true;
        this.jumpingUp = true;
    }

    moduleEnd() {
        this.jumpingUp = false;
    }

    update(dt:number) {
        let ih = this.ih;

        if(!ih.IsPressed('jump') || this.e.sprite.body.blocked.up)
            this.jumpingUp = false;
        if(this.DeltaJump <= C.PLAYER_JUMP_TIME) {
            this.DeltaJump += dt;
        } else {
            this.jumpingUp = false;
        }

        if(this.jumpingUp) {
            this.e.sprite.setVelocityY(-C.PLAYER_JUMP_STR);
        }

        let ax = 0;
        if(ih.IsPressed('left'))
            ax--;
        if(ih.IsPressed('right'))
            ax++;

        this.e.scene.events.emit('debug', `P Accel Air: ${ax}`);
        this.e.sprite.setAccelerationX(ax * C.PLAYER_AIR_ACCEL);
        
        if(!this.FirstPass) {
            if(this.e.sprite.body.blocked.down) {
                this.e.gs.events.emit('sound', SOUND.LAND);

                this.parent.changeFSM('ground');
            } 
        }

        this.FirstPass = false;
        
        this.ChangeAnimation();
    }

    ChangeAnimation() {
        if(this.e.sprite.body.velocity.y < 0) {
            this.e.PlayAnimation('jumpup');
        } else {
            this.e.PlayAnimation('jumpdown');
        }

        if(this.ih.IsPressed('left')) {
            this.e.sprite.flipX = true;
        } else if(this.ih.IsPressed('right'))
            this.e.sprite.flipX = false;
    }
}