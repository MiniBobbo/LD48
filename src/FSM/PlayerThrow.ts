import { C } from "../C";
import { Entity } from "../entities/Entity";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule";

export class PlayerThrow extends FSMModule {

    e!:Entity;
    ih!:IH;
    throwTime:number = 300;
    remaining:number = 0;

    moduleStart() {
        this.e = this.parent as Entity;
        this.ih = this.e.ih;
        this.remaining = this.throwTime;
        this.e.PlayAnimation('throw');
    }

    moduleEnd() {

    }

    update(dt:number) {
        if(this.e.sprite.body.blocked.down)
           this.e.sprite.setDragX(C.PLAYER_GROUND_DRAG);
        this.remaining -= dt;
        if(this.remaining <= 0) {
            if(this.e.sprite.body.blocked.down)
                this.parent.changeFSM('ground');
            else
                this.parent.changeFSM('air');


        }

    }

}