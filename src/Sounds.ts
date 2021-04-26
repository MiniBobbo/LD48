export class Sounds {
    s:Phaser.Scene;
    constructor(s:Phaser.Scene) {
        this.s = s;
        s.sound.add('jump', {volume:.5});
        s.sound.add('land', {volume:.5});

    }

    PlaySound(sound:SOUND) {
        this.s.sound.play(sound, {volume:.5});
        
    }
}

export enum SOUND {
    JUMP = 'jump',
    THROW = 'throw',
    LAND = 'land',
    DEAD = 'dead',
    STEP = 'step',
    FLAMEOUT= 'flameout'
}