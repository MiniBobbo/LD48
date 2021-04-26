import { IH } from "../IH/IH";

export class Preload extends Phaser.Scene {
    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value:any) {
            //@ts-ignore
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file:any) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            //@ts-ignore
            this.scene.start('menu');
        }, this);
    
        this.load.setBaseURL('./assets/')
        this.load.image('tileset', ['tileset.png', 'tileset_n.png']);
        this.load.bitmapFont('6px', 'munro_0.png', 'munro.fnt');
        this.load.bitmapFont('8px', '8px_0.png', '8px.fnt');
        this.load.multiatlas('atlas', 'atlas.json');
        this.load.json('levels', 'levels.ldtk');
        this.load.image('button', ['button_0.png', 'button_0_n.png']);
        this.load.image('menubutton', 'button.png');
        this.load.image('bg', ['bg.png', 'bg_n.png']);
        this.load.image('title', ['title.png', 'title_n.png']);

        this.LoadSounds();
    }


    create() {
        IH.AddVirtualInput('up');
        IH.AddVirtualInput('down');
        IH.AddVirtualInput('left');
        IH.AddVirtualInput('right');
        IH.AddVirtualInput('jump');
        IH.AddVirtualInput('throw');
        IH.AddVirtualInput('attack');

        IH.AssignKeyToVirtualInput('UP', 'up');
        IH.AssignKeyToVirtualInput('DOWN', 'down');
        IH.AssignKeyToVirtualInput('LEFT', 'left');
        IH.AssignKeyToVirtualInput('RIGHT', 'right');
        IH.AssignKeyToVirtualInput('W', 'up');
        IH.AssignKeyToVirtualInput('S', 'down');
        IH.AssignKeyToVirtualInput('A', 'left');
        IH.AssignKeyToVirtualInput('D', 'right');
        IH.AssignKeyToVirtualInput('Z', 'jump');
        IH.AssignKeyToVirtualInput('L', 'jump');
        IH.AssignKeyToVirtualInput('K', 'attack');
        IH.AssignKeyToVirtualInput('X', 'attack');
        IH.AssignKeyToVirtualInput('O', 'throw');

        // let r = this.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
        // r.pipelines.add('gray', new GrayScalePipeline(this.game));

        this.anims.create({ key: 'door_closed', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'doors_closed_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'door_open', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'doors_open_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'ghost_float', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'ghosts_float_', end: 3}), repeat: -1 });
        this.anims.create({ key: 'ghost_angry', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'ghosts_angered_', end: 3}), repeat: -1 });
        this.anims.create({ key: 'waterfall_overflow', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'waterfall_overflow_', end: 3}), repeat: -1 });
        this.anims.create({ key: 'waterfall_falling', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'waterfall_falling_', end: 3}), repeat: -1 });
        this.anims.create({ key: 'waterfall_hitting', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'waterfall_hitting_', end: 3}), repeat: -1 });
        this.anims.create({ key: 'player_stand', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_stand_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'player_stand_hold', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_stand_hold_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'player_run', frameRate: 10, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_run_', end: 5}), repeat: -1 });
        this.anims.create({ key: 'player_run_hold', frameRate: 10, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_run_hold_', end: 5}), repeat: -1 });
        // this.anims.create({ key: 'player_walktowards', frameRate: 3, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_walktowards_', end: 1}), repeat: -1 });
        this.anims.create({ key: 'player_jumpup', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpup_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'player_jumpup_hold', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpup_hold_', end: 0}), repeat: -1 });
        this.anims.create({ key: 'player_dead', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_dead.png_', end: 36}), repeat: 0 });
        this.anims.create({ key: 'player_throw_hold', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_throw_', end: 5}), repeat: 0 });
        this.anims.create({ key: 'player_throw', frameRate: 20, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_throw_', end: 5}), repeat: 0 });
        this.anims.create({ key: 'player_dead_hold', frameRate: 60, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_dead.png_', end: 36}), repeat: 0 });
        this.anims.create({ key: 'player_jumpdown', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpdown_', end: 1}), repeat: 0 });
        this.anims.create({ key: 'player_jumpdown_hold', frameRate: 6, frames: this.anims.generateFrameNames('atlas', { prefix: 'player_jumpdown_hold_', end: 1}), repeat: 0 });

    }

    LoadSounds() {
        this.load.audio('throw', './sounds/throw.wav');
        this.load.audio('land', './sounds/land.wav');
        this.load.audio('flameout', './sounds/flameout.wav');
        this.load.audio('jump', './sounds/jump.wav');
        this.load.audio('dead', './sounds/dead.wav');
        this.load.audio('step', './sounds/footstep.wav');
        this.load.audio('mystery', ['./sounds/Mystery.mp3', './sounds/Mystery.ogg']);
    }
}