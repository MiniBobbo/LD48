import { isThisTypeNode } from "typescript";
import { Flame } from "../Flame";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";

export class TestScene extends Phaser.Scene {
    maps!:LDtkMapPack;
    character:Phaser.GameObjects.Sprite;
    flame:Flame;
    create() {
        let r = new LdtkReader(this,this.cache.json.get('levels'));

        this.maps = r.CreateMap("Level_0", 'tileset');
        this.maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
            if(l.name == 'Bg')
                l.setDepth(0);
            if(l.name == 'Mg')
                l.setDepth(100);
            if(l.name == 'Fg')
                l.setDepth(200);
        })

        // this.add.text(100,100,'Test Scene').setPipeline('Light2D');

        this.lights.enable();
        this.lights.setAmbientColor(0x222222);

        this.maps.displayLayers.forEach(element => {
            element.setPipeline('Light2D');
        });

        this.flame = new Flame(this);

        this.input.on('pointermove',  (pointer)=> {
            this.flame.SetPosition(pointer.x, pointer.y);
            // this.mainLight.x = pointer.x;
            // this.mainLight.y = pointer.y;
            // this.character.x = pointer.x;
            // this.character.y = pointer.y;
            // light2.x = pointer.x;
            // this.e.x = pointer.x;
            // light2.x = pointer.x;
            // light2.y = pointer.y;
    
        }, this);

    }
    update() {

    }


}