import { FSM } from "../FSM/FSM";
import { IH } from "../IH/IH";
import { GameScene } from "../scenes/GameScene";
import { NothingFSM } from "../FSM/NothingFSM";

export class Entity {
    sprite:Phaser.Physics.Arcade.Sprite;
    scene:Phaser.Scene;
    lastAnim!:string;
    fsm:FSM;
    ih:IH;
    hp:number = 5;
    maxhp:number = 5;
    gs:GameScene;
    flashing:boolean = false;
    flashingRemaining:number = 0;
    flashTime:number = 200;
    lit:boolean = false;


    constructor(scene:Phaser.Scene, ih:IH) {
        this.gs = scene as GameScene;
        this.sprite = scene.physics.add.sprite(0,0, 'atlas', 'player_stand_0')
        // .setPipeline('Light2D');
        this.sprite.setSize(16,16);
        this.scene = scene;
        this.sprite.name = '';
        this.sprite.setDepth(50);
        this.fsm = new FSM(this);
        this.fsm.addModule('nothing', new NothingFSM(this));
        this.ih = ih;

        this.gs.entities.push(this);


        this.sprite.on('damage', this.Damage, this);
        this.sprite.on('stun', this.Stun, this);
        this.sprite.on('dead', this.Dead, this);
        this.sprite.on('hitbyattack', this.HitByAttack, this);

        this.scene.events.on('update',this.Update, this)
        this.scene.events.on('travel',() => {this.fsm.clearModule();}, this);
    }

    dispose() {
        console.log(`Entity disposed.`);
        this.scene.events.removeListener('update',this.Update, this)
        this.scene.events.removeListener('travel',() => {this.fsm.clearModule();}, this);
        this.fsm.dispose();
        if(this.sprite != null)
            this.sprite.destroy();
        this.sprite = null;
    }

    Update(time:number, dt:number) {
        this.fsm.update(time, dt);
        if(this.flashing) {
            if(this.sprite.alpha == 1)
                this.sprite.alpha = 0;
            else
                this.sprite.alpha = 1;
            this.flashingRemaining -= dt;
            if(this.flashingRemaining <= 0) {
                this.flashing = false;
                this.sprite.alpha = 1;
            }
        }
    }

    changeFSM(nextFSM:string) {
        this.fsm.changeModule(nextFSM);
    }

    Stun(args:{stunTime:number, returnFSM:string, stunDir?:{x:number, y:number}}) {
        this.fsm.changeModule('stun', args);
    }

    HitByAttack() {
        this.sprite.emit('damage', 1);
    }
    /**
     * Helper Function.  Passes along the emit to the sprite who is actually registered with the event system.
     * @param event 
     * @param args 
     */
    emit(event:string, args?:any[]) {
        this.sprite.emit(event, args);
    }

    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        let combinedAnim = `${this.sprite.name}_${anim}`;
        if(ignoreIfPlaying && combinedAnim == this.lastAnim)
            return;
        this.sprite.anims.play(combinedAnim, ignoreIfPlaying);
        this.sprite.setOffset(this.sprite.width/2 - this.sprite.body.width/2, this.sprite.height/2- this.sprite.body.height/2);
        this.lastAnim = combinedAnim;
    }

    Damage(damage:number = 1) {
        if(this.flashing)
            return;
        this.Flash(this.flashTime);
        this.hp -= damage;
        this.hp = Phaser.Math.Clamp(this.hp, 0, this.maxhp);
        if(this.hp == 0) {
            this.emit('dead');
        }
    }

    Dead() {
        console.log(`${this.sprite.name} dead`);
        this.sprite.body.enable = false;
        this.sprite.setVisible(false);
        this.fsm.changeModule('nothing');
    }

    Flash(length:number = 1000) {
        this.flashing = true;
        this.flashingRemaining = length;
    }
}