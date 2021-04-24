import { GameData } from "./GameData";

export class C {
    static currentLevel:string = 'Level_0';

    static TILE_SIZE:number = 10;
    // static GRAVITY:number = 0;
    static GRAVITY:number = 1000;
    static MAX_Y_SPEED:number = 500;
    static PLAYER_GROUND_SPEED:number = 100;
    static PLAYER_CLIMB_SPEED:number = 50;
    static PLAYER_AIR_SPEED:number = 100;
    static PLAYER_GROUND_ACCEL:number = 400;
    static PLAYER_AIR_ACCEL:number = 400;
    static PLAYER_GROUND_DRAG:number = 400;
    static PLAYER_AIR_DRAG:number = 400;
    static PLAYER_JUMP_STR:number = 200;
    static PLAYER_JUMP_TIME:number = 300;
    static PLAYER_ATTACK_TIME:number = 250;
    static PLAYER_THROW_X:number = 150;
    static PLAYER_THROW_Y:number = -100;


    static FLAG_COUNT:number = 100;
    static gd:GameData;

    static GAME_NAME = 'InitialGame';

    static RoundToTile(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE) * C.TILE_SIZE;
        newY = Math.floor(y/C.TILE_SIZE) * C.TILE_SIZE;
        return {x:newX, y:newY};
    }

    static checkFlag(flag:string):boolean {
        //@ts-ignore
        return this.gd.flags[flag];
    }
    static setFlag(flag:string, value:boolean) {
        //@ts-ignore
        this.gd.flags[flag] = value;
    }
}