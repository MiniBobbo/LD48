/**
 * Input Helper (abbreviated IH) is a tool designed to simplify inputs for Phaser into a single
 * controller.  It allows for multiple keys on the keyboard or controllers to be mapped to 
 * virtual buttons where logic can be assigned in the game objects. 
 */
export class IH {
    private static VI:Array<string>;
    private VIDown:Map<string, boolean>;
    private VILastDown:Map<string, boolean>;

    private static KeyToVIMaster:Map<string, string>;
    private KeyToVI:Map<Phaser.Input.Keyboard.Key, string>;
    private Keys:Array<Phaser.Input.Keyboard.Key>;

    private static MouseClickVI:string;

    //This flag is for reference and doesn't affect behavior.
    private holdInput:boolean = false;

    private s:Phaser.Scene;

    constructor(scene:Phaser.Scene) {
        this.s = scene;
        this.VIDown = new Map<string, boolean>();
        this.VILastDown = new Map<string, boolean>();
        this.KeyToVI = new Map<Phaser.Input.Keyboard.Key,string>();
        this.Keys = [];

        scene.events.on('holdinput', () => { this.holdInput = true;});
        scene.events.on('resumeinput', () => { this.holdInput = false;});
        scene.events.on('destroy', () => { 
            scene.events.removeListener('holdinput');    
            scene.events.removeListener('resumeinput');    
            scene.events.removeListener('destroy');    

        });


        IH.VI.forEach(element => {
            this.VIDown.set(element, false);
            this.VILastDown.set(element, false);
        }, this);

        let masterKeys = IH.KeyToVIMaster.keys();
        for(let k of Array.from(IH.KeyToVIMaster.keys())) {
            let thisKey = this.s.input.keyboard.addKey(k);
            this.Keys.push(thisKey);
            //@ts-ignore
            this.KeyToVI.set(thisKey, IH.KeyToVIMaster.get(k));

        }

        // if(IH.MouseClickVI != null) {
        //     this.s.input.on('pointerdown', this.MouseClicked, this);
        // }

    }

    private MouseClicked() {
        if(this.VIDown.has(IH.MouseClickVI))
            this.VIDown.set(IH.MouseClickVI, true);
    }

    static MapMouseToVirtualInput(virtualInput:string) {
        this.MouseClickVI = virtualInput;
    }

    update() {
        if(this.holdInput)
            return;
        this.VIDown.forEach( function(v,k,m) {
            //@ts-ignore
            this.VILastDown.set(k, v);
            //@ts-ignore
            this.VIDown.set(k, false);
        }, this); 

        //Check mouse VI
        if(IH.MouseClickVI != null) {
            if(this.s.input.activePointer.isDown)
                this.VIDown.set(IH.MouseClickVI, true);
        }

        for(let k of this.Keys) {
            if(k.isDown) {
                let pressed = this.KeyToVI.get(k);
                this.VIDown.set(pressed!, true);
            }
        }
    }

    static AddVirtualInput(ID:string) {
        if(this.VI == null) {
            this.VI = [];
        }
        //TODO: Check if the VI already exists.
        this.VI.push(ID.toLowerCase());
    }

    static AssignKeyToVirtualInput(key:string, inputID:string) {
        if(this.KeyToVIMaster == null) 
            this.KeyToVIMaster = new Map<string, string>();
        this.KeyToVIMaster.set(key, inputID);
    }

    Debug():string {
        let s = '';
        IH.VI.forEach(e => {
            s += `${e} : Down-${this.VIDown.get(e)}  LastDown-${this.VILastDown.get(e)} \n`;
        });

        s+= '\n\nMASTER\n';

        IH.KeyToVIMaster.forEach(function(v, k, m) {
            s += `${k} assigned to ${v}\n`;
        });

        return s;
    } 

    IsPressed(virtualInput:string) {
        if(this.VIDown.has(virtualInput))
            return this.VIDown.get(virtualInput);
        else
        return false;
    }
    
    IsJustPressed(virtualInput:string) {
        if(this.VIDown.has(virtualInput)) {
            if(this.VIDown.get(virtualInput) && !this.VILastDown.get(virtualInput))
                return true;
            else
                return false;
        }
        else
        return false;
    }

}