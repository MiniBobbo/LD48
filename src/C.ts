import { GameData } from "./GameData";
import { GameState } from "./scenes/GameScene";

export class C {
    static currentLevel:string = 'Level_0';
    static currentLevelNum:number = 0;
    static lastGameState:GameState = GameState.GAME;
    static lastCompleteTime:number = 0;

    static TILE_SIZE:number = 10;
    // static GRAVITY:number = 0;
    static GRAVITY:number = 600;
    static MAX_Y_SPEED:number = 500;
    static PLAYER_GROUND_SPEED:number = 80;
    static PLAYER_AIR_SPEED:number = 80;
    static PLAYER_GROUND_ACCEL:number = 400;
    static PLAYER_AIR_ACCEL:number = 400;
    static PLAYER_GROUND_DRAG:number = 400;
    static PLAYER_AIR_DRAG:number = 400;
    static PLAYER_JUMP_STR:number = 150;
    static PLAYER_JUMP_TIME:number = 200;
    static PLAYER_THROW_X:number = 100;
    static PLAYER_THROW_Y:number = -75;
    static PLAYER_THROW_UP:{x:number, y:number} = {x:20, y: -150};
    static PLAYER_THROW_DOWN:{x:number, y:number} = {x:20, y: -20};
    static MAX_LEVEL:number = 8;


    static gd:GameData;

    static GAME_NAME = 'Downwardgame';

    static SaveGameData() {
        localStorage.setItem(this.GAME_NAME, JSON.stringify(C.gd));
    }

    static LoadGameData() {
        C.gd = JSON.parse(localStorage.getItem(this.GAME_NAME));
        if(C.gd == null) {
            C.gd = new GameData();
        if(C.gd.times.length <= C.MAX_LEVEL)
            C.gd = null;
            this.SaveGameData();
        }


    }

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

    static getCurrentLevelName() {
        return `Level_${this.currentLevelNum}`;
    }
}