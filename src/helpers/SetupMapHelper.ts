import { Player } from "../entities/Player";
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

        gs.cameras.main.setBounds(0,0, maps.collideLayer.width, maps.collideLayer.height);


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

    }

    static CreatePlayer(gs:GameScene, maps:LDtkMapPack) {
        let StartLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'Start');
        gs.player = new Player(gs, gs.ih);
        gs.player.sprite.setPosition(StartLocation.px[0], StartLocation.px[1] + 6);
        gs.player.sprite.alpha = 0;
        gs.cameras.main.startFollow(gs.player.sprite);
        gs.flame = new Flame(gs);
        gs.collideMap.push(gs.flame.collision);
        gs.events.emit('flameoff');


    }

    static CreatePhysics(gs:GameScene, maps:LDtkMapPack) {
        gs.physics.add.collider(gs.collideMap, maps.collideLayer);
        let EndLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'End');
        let endzone = gs.add.zone(EndLocation.px[0], EndLocation.px[1], 10,10);
        gs.physics.world.enable(endzone);

        gs.physics.add.overlap(gs.player.sprite, endzone , () => {  gs.events.emit('playerwin');});

    }

}