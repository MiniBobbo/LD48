export class Button extends Phaser.GameObjects.Container {
    Text:Phaser.GameObjects.Text;
    constructor(scene:Phaser.Scene, x:number, y:number) {
        super(scene, x, y);
        this.name = 'Default Button';
        this.Text = scene.add.text(0,0,'Button Text');
        this.add(this.Text);
        this.setSize(100,100);
        // this.setInteractive(null, this.Clicked);
    }

    Clicked() {
        console.log(`'Clicked ${this.name}`);
    }
}