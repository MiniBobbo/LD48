import { FSMModule } from "./FSMModule";
import { Entity } from "../entities/Entity";

export class NothingFSM extends FSMModule {
    grav:Phaser.Math.Vector2;
    moduleStart(args:any) {
        //Cancel gravity.
        let e = this.parent as Entity;  
        e.sprite.body.enable = false;
        // this.grav = new Phaser.Math.Vector2();
        // this.grav.copy(e.sprite.body.gravity);

    }

    moduleEnd(args:any) {
        let e = this.parent as Entity;  
        e.sprite.body.enable = true;
        // e.sprite.body.gravity.copy(this.grav);
    }
}