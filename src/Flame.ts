import { C } from "./C";
import { GameScene } from "./scenes/GameScene";
import { SOUND } from "./Sounds";

export class Flame {
    scene:Phaser.Scene;
    light:Phaser.GameObjects.Light;
    e:Phaser.GameObjects.Particles.ParticleEmitter;
    e2:Phaser.GameObjects.Particles.ParticleEmitter;
    offset:{x:number, y:number};
    currentlyOn:boolean = false;
    collision:Phaser.Physics.Arcade.Sprite;
    thrown:boolean = true;


    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        var shape1 = new Phaser.Geom.Circle(0, 0, 3);
        var shape2 = new Phaser.Geom.Circle(0, 0, 2);
        // let pz:Phaser.GameObjects.Particles.Zones.RandomZone;
        let p = this.scene.add.particles('atlas').setPipeline('Light2D').setDepth(151);

        this.collision = scene.physics.add.sprite(-1000,-1000, 'atlas',  'particles_1');
        this.collision.setBounce(.3).setDragX(C.PLAYER_GROUND_DRAG);

        this.e = p.createEmitter({
            frame:'particles_1',
            radial:false,
            quantity: 1,
            lifespan: 1000,
            //@ts-ignore
            emitZone:{ type: 'random', source: shape1 },
            gravityY:-80,
            scale: { start: 1, end: 0, ease: 'Power3' },
            // blendMode: 'ADD'
        });
        this.e2 = p.createEmitter({
            frame:'particles_0',
            radial:false,
            quantity: 1,
            lifespan: 1000,
            //@ts-ignore
            emitZone:{ type: 'random', source: shape2 },
            gravityY:-80,
            scale: { start: 1, end: 0, ease: 'Power3' },
            blendMode: 'ADD'
        });
        this.light = this.scene.lights.addLight(400, 300, 120).setIntensity(1.5).setColor(0xffffff);

        this.scene.events.on('throw', this.Throw, this);
        this.scene.events.on('follow', this.FollowOffset, this);

        this.scene.events.on('flameoff', this.FlameOff, this);
        this.scene.events.on('flameon', this.FlameOn, this);

        this.scene.events.on(Phaser.Core.Events.PRE_RENDER, this.Update, this);


    }
    Update(arg0: string, Update: any, arg2: this) {
        if(this.thrown) {
            if(this.collision.body.blocked.down)
                this.collision.setDragX(C.PLAYER_GROUND_DRAG);
            else
            this.collision.setDragX(0);

            this.SetPosition(this.collision.x, this.collision.y);
        }
    }


    FlameOff() {
        if(this.currentlyOn == true)
            this.scene.events.emit('sound', SOUND.FLAMEOUT);
        this.e.stop();
        this.e2.stop();
        this.light.setVisible(false);
        this.currentlyOn = false;

    }

    FlameOn() {
        this.e.start();
        this.e2.start();
        this.light.setVisible(true);
        this.currentlyOn = true;
    }

    SetPosition(x:number, y:number) {
        this.light.setPosition(x,y);
        this.e.setPosition(x,y);
        this.e2.setPosition(x,y);
    }


    Throw(obj:Phaser.GameObjects.GameObject) {

    }

    FollowOffset(obj:Phaser.GameObjects.GameObject) {

    }

    dispose() {
        this.scene.events.removeListener('throw', this.Throw, this);
        this.scene.events.removeListener('follow', this.FollowOffset, this);
        this.scene.events.removeListener('flameoff', this.FlameOff, this);
        this.scene.events.removeListener('flameon', this.FlameOn, this);
        this.scene.events.removeListener('flameon', this.FlameOn, this);
        this.scene.events.removeListener(Phaser.Core.Events.PRE_RENDER, this.Update, this);
        this.collision.destroy();

    }

}