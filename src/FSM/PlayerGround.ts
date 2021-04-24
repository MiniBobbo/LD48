import { FSMModule } from "./FSMModule";
import { IH } from "../IH/IH";
import { C } from "../C";
import { Entity } from "../entities/Entity";

export class PlayerGround extends FSMModule {
    e!:Entity;
    ih!:IH;
    
    moduleStart() {
        this.e = this.parent as Entity;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_SPEED, C.MAX_Y_SPEED);
        this.e.sprite.setDragX(C.PLAYER_GROUND_DRAG);
    }

    moduleEnd() {

    }

    update(dt:number) {
        let ih = this.ih;
        let ax = 0;
        if(ih.IsJustPressed('attack')) {
            this.e.changeFSM('attack');
            return;
        }

        if(ih.IsJustPressed('throw')) {
            this.e.emit('throwball');
        }


        if(ih.IsPressed('left'))
            ax--;
        if(ih.IsPressed('right'))
            ax++;
        if(ih.IsJustPressed('jump')) {
            this.parent.changeFSM('air');
            this.e.sprite.setVelocityY(-C.PLAYER_JUMP_STR);
            this.e.sprite.y -= 1;
            this.e.sprite.body.touching.down = false;
            this.e.sprite.body.blocked.down = false;

            return;
        }
        this.e.scene.events.emit('debug', `P Accel: ${ax}`);
        this.e.sprite.setAccelerationX(ax * C.PLAYER_GROUND_ACCEL);
        


        if( !this.e.sprite.body.blocked.down) {
            this.parent.changeFSM('air');
            return;
        }
        
        this.ChangeAnimation();
    }

    ChangeAnimation() {
        if(this.ih.IsPressed('left')) {
            this.e.PlayAnimation('run');
            this.e.sprite.flipX = true;
        }
        else if(this.ih.IsPressed('right')) {
            this.e.PlayAnimation('run');
            this.e.sprite.flipX = false;
        } else {
            this.e.PlayAnimation('stand');

        }


    }
}