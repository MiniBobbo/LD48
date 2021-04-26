import { C } from "../C";
import { Bolter } from "../entities/Bolter";
import { Ghost } from "../entities/Ghost";
import { Player } from "../entities/Player";
import { Torch } from "../entities/Torch";
import { Flame } from "../Flame";
import { EntityInstance, FieldInstance, LDtkMapPack } from "../map/LDtkReader";
import { GameScene } from "../scenes/GameScene";

export class SetupMapHelper {
    
    static SetupMap(gs:GameScene, maps:LDtkMapPack) {
        gs.collideMap=[];

        gs.maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
            if(l.name == 'Bg')
                l.setDepth(0);
            if(l.name == 'Mg')
                l.setDepth(100);
            if(l.name == 'Fg')
                l.setDepth(200);
        });

        maps.collideLayer.setCollision([1,3]);

        gs.lights.enable();
        let amb = maps.settings[0];
        // let amb = maps.settings.find((i:FieldInstance) => {i.__identifier === 'Ambient'} );
        gs.lights.setAmbientColor(Number(amb.__value));

        gs.maps.displayLayers.forEach(element => {
            element.setPipeline('Light2D');
        });

        // gs.cameras.main.setBounds(0,-2000, maps.collideLayer.width, 2000);
        // gs.cameras.main.setBounds(0,0, maps.collideLayer.width, maps.collideLayer.height);


        this.CreateEntities(gs, maps);

        this.CreatePlayer(gs,maps);
        this.CreatePhysics(gs,maps);


    }
    static CreateEntities(gs: GameScene, maps: LDtkMapPack) {
        let StartLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'Start');
        gs.add.sprite(StartLocation.px[0], StartLocation.px[1] + 5, 'atlas', 'doors_closed_0').setPipeline('Light2D');
        let EndLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'End');
        gs.add.sprite(EndLocation.px[0], EndLocation.px[1] + 5, 'atlas', 'doors_open_0').setPipeline('Light2D');
        gs.endLocation.x = EndLocation.px[0];
        gs.endLocation.y = EndLocation.px[1] + 5;

        maps.entityLayers.entityInstances.forEach(element => {
            if(element.__identifier == 'Text') {
                let message = element.fieldInstances[0];
                let t = gs.add.bitmapText(element.px[0], element.px[1], '8px', message.__value)
                .setPipeline('Light2D').setMaxWidth(element.width).setDepth(150).setCenterAlign();
            } else if (element.__identifier == 'Torch') {
                let t = new Torch(gs, element);
            } else if (element.__identifier == 'Bolters') {
                let t = new Bolter(gs, gs.ih, element);
            } else if (element.__identifier == 'Ghost') {
                let g = new Ghost(gs, gs.ih);
                if(!element.fieldInstances[0].__value) {
                    g.CollideMap();
                } else {
                    g.fsm.changeModule('angrywait');
                    g.sprite.setAlpha(.6);
                }
                g.sprite.setPosition(element.px[0], element.px[1]);
                gs.dangerSprites.push(g.sprite);
            } else if (element.__identifier == 'Waterfall') {
                let w = gs.add.sprite(element.px[0], element.px[1], 'atlas', 'waterfall_falling_0').setPipeline('Light2D').setOrigin(0,0).setDepth(200);
                w.play('waterfall_overflow');
                let bottom:boolean = false;
                let pos:{x:number, y:number} = {x:element.__grid[0], y:element.__grid[1]};
                while(!bottom) {
                    pos.y++;
                    let index = maps.collideLayer.getTileAt(pos.x, pos.y).index;
                    if(index == 2) {
                        bottom = true;
                        let w = gs.add.sprite(pos.x * C.TILE_SIZE, pos.y * C.TILE_SIZE, 'atlas', 'waterfall_falling_0').setPipeline('Light2D').setOrigin(0,0).setDepth(200);
                        w.play('waterfall_hitting');
                    } else if(index == 1) {
                        bottom = true;
                        let w = gs.add.sprite(pos.x * C.TILE_SIZE, (pos.y -1) * C.TILE_SIZE, 'atlas', 'waterfall_falling_0').setPipeline('Light2D').setOrigin(0,0).setDepth(200);
                        w.play('waterfall_hitting');
                    } else {
                        let w = gs.add.sprite(pos.x * C.TILE_SIZE, (pos.y) * C.TILE_SIZE, 'atlas', 'waterfall_falling_0').setPipeline('Light2D').setOrigin(0,0).setDepth(200);
                        w.play('waterfall_falling');

                    }
                }
                let dz = gs.add.zone(element.px[0]+1, element.px[1] + 5, 8, (pos.y - element.__grid[1]) * C.TILE_SIZE).setOrigin(0,0);
                gs.physics.world.enable(dz);
                gs.extinguishZones.push(dz);
                gs.soakZones.push(dz);

            }
        });

    }

    static CreatePlayer(gs:GameScene, maps:LDtkMapPack) {
        let StartLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'Start');
        gs.player = new Player(gs, gs.ih);
        gs.player.sprite.setPosition(StartLocation.px[0], StartLocation.px[1] + 6);
        gs.player.sprite.alpha = 0;
        // gs.cameras.main.startFollow(gs.player.sprite);
        gs.flame = new Flame(gs);
        gs.collideMap.push(gs.flame.collision);
        gs.events.emit('flameoff');
        gs.cam.image.x = gs.player.sprite.x;
        gs.cam.image.y = -1000;



    }

    static CreatePhysics(gs:GameScene, maps:LDtkMapPack) {
        gs.physics.add.collider(gs.collideMap, maps.collideLayer);
        let EndLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'End');
        let endzone = gs.add.zone(EndLocation.px[0]-1, EndLocation.px[1]+2, 4,4).setOrigin(0,0);
        gs.physics.world.enable(endzone);

        gs.physics.add.overlap(gs.player.sprite, endzone , () => {  gs.events.emit('playerwin');});

        let dl = maps.displayLayers.find((t:Phaser.Tilemaps.TilemapLayer) => t.name == 'Fg');
        let tiles = dl.getTilesWithin(0,0,dl.width, dl.height);
        tiles.forEach(element => {
            if(element.index == 50) {
                let dz = gs.add.zone(element.pixelX + 5, element.pixelY + 8, 7, 4);
                gs.physics.world.enable(dz);
                gs.deathZones.push(dz);
            }
            else if(element.index == 69) {
                let dz = gs.add.zone(element.pixelX + 8, element.pixelY + 4, 4, 7);
                gs.physics.world.enable(dz);
                gs.deathZones.push(dz);
            }
            else if(element.index == 71) {
                let dz = gs.add.zone(element.pixelX+2, element.pixelY + 4, 4, 7);
                gs.physics.world.enable(dz);
                gs.deathZones.push(dz);
            }
            else if(element.index == 90) {
                let dz = gs.add.zone(element.pixelX + 5, element.pixelY+2, 7, 4);
                gs.physics.world.enable(dz);
                gs.deathZones.push(dz);
            }
            else if(element.index == 27) {
                let dz = gs.add.zone(element.pixelX, element.pixelY + 5, 10,5).setOrigin(0,0);
                gs.physics.world.enable(dz);
                gs.deathZones.push(dz);
                gs.extinguishZones.push(dz);
            }
            else if(element.index == 7) {
                let dz = gs.add.zone(element.pixelX, element.pixelY + 6, 10,4).setOrigin(0,0);
                gs.physics.world.enable(dz);
                gs.extinguishZones.push(dz);
            }

        });

        gs.physics.add.overlap(gs.player.sprite, gs.soakZones , () => {  gs.events.emit('flameoff');});
        gs.physics.add.overlap(gs.player.sprite, gs.dangerSprites , () => {  gs.events.emit('playerdead');});
        gs.physics.add.overlap(gs.player.sprite, gs.deathZones , () => {  gs.events.emit('playerdead');});
        gs.physics.add.overlap(gs.flame.collision, gs.extinguishZones , () => {  gs.events.emit('flameoff');});



    }


}