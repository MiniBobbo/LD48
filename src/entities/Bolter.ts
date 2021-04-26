import { IH } from "../IH/IH";
import { EntityInstance } from "../map/LDtkReader";
import { GameScene } from "../scenes/GameScene";
import { Entity } from "./Entity";

export class Bolter extends Entity {
    boltTime:number = 2000;
    deltaBoltTime:number = 2000;
    velX:number = 0;
    vely:number = 0;
    going:boolean = false;
    bullet:Phaser.Physics.Arcade.Sprite;
    constructor(scene:Phaser.Scene, ih:IH, ei:EntityInstance) {
        super(scene, ih);
        this.sprite.setFrame('boltshooters_0');
        this.sprite.setPosition(ei.px[0],ei.px[1]).setDepth(120).setOrigin(0,0);
        this.sprite.setSize(10,10).setPipeline('Light2D');
        this.sprite.name = 'bolter';
        this.sprite.setDepth(155);

        this.bullet = this.scene.physics.add.sprite(-1000,-1000, 'atlas', 'boltshooters_2').setDepth(154).setSize(4,4);
        let gs:GameScene = scene as GameScene;
        gs.dangerSprites.push(this.bullet);
        this.velX = ei.fieldInstances[2].__value;
        if(ei.fieldInstances[0].__value == "Left") {
            this.velX *= -1;
            this.sprite.flipX = true;
            this.bullet.flipX = true;
        }

        this.scene.events.once('startlevel', () =>{
            this.deltaBoltTime = this.boltTime;
            this.going = true;
        }, this);

        this.gs.collideMap.push(this.bullet);
        
        // this.fsm.addModule('wait', new GhostWaitFSM(this));
        // this.fsm.addModule('wander', new GhostWanderFSM(this));
        // this.fsm.addModule('angrywait', new GhostAngryWaitFSM(this));
        // this.fsm.addModule('chase', new GhostAngryChaseFSM(this));
        // this.fsm.changeModule('wait');

    }

    dispose() {
        this.bullet.destroy();
        super.dispose();
    }

    Update(time:number, dt:number) {
        if(this.going) {
            this.deltaBoltTime -= dt;

            if(this.deltaBoltTime <= 0) {
                console.log('bolter fire');
                this.deltaBoltTime = this.boltTime;
                this.bullet.enableBody(true, this.sprite.x+5, this.sprite.y+5, true, true);
                this.bullet.setVelocityX(this.velX);
            }
    
        }

        if(this.bullet.body.blocked.left || this.bullet.body.blocked.right ) {
            this.bullet.disableBody(true, true);
        }
    }


}