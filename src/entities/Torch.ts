import { EntityInstance } from "../map/LDtkReader";

export class Torch {
    scene:Phaser.Scene;
    light:Phaser.GameObjects.Light;
    e:Phaser.GameObjects.Particles.ParticleEmitter;
    e2:Phaser.GameObjects.Particles.ParticleEmitter;
    offset:{x:number, y:number};
    currentlyOn:boolean = false;
    sprite:Phaser.GameObjects.Sprite;


    constructor(scene:Phaser.Scene, ei:EntityInstance) {
        this.scene = scene;
        var shape1 = new Phaser.Geom.Circle(0, 0, 2);
        var shape2 = new Phaser.Geom.Circle(0, 0, 2);

        this.sprite = this.scene.add.sprite(ei.px[0], ei.px[1], 'atlas', 'torch_0').setPipeline('Light2D').setDepth(101);
        let p = this.scene.add.particles('atlas').setPipeline('Light2D').setDepth(102);

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
        this.light = this.scene.lights.addLight(400, 300, ei.fieldInstances[0].__value).setIntensity(1.0).setColor(0xffffff);

        this.scene.events.on('torchesoff', this.FlameOff, this);
        this.scene.events.on('torcheson', this.FlameOn, this);
        this.SetPosition(ei.px[0]+5, ei.px[1]+5);
        this.FlameOn();
    }


    FlameOff() {
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

        this.light.setPosition(x,y-5);
        this.e.setPosition(x,y-5);
        this.e2.setPosition(x,y-5);
        this.sprite.setPosition(x,y);
    }


    Throw(obj:Phaser.GameObjects.GameObject) {

    }

    FollowOffset(obj:Phaser.GameObjects.GameObject) {

    }

    dispose() {
        this.scene.events.removeListener('torchesff', this.FlameOff, this);
        this.scene.events.removeListener('torcheson', this.FlameOn, this);

    }

}