import { C } from "./C";

export class GameData {
    flags:Array<boolean>;
    times:Array<number>;

    constructor() {
        this.times = new Array<number>(C.MAX_LEVEL + 1);
        for(let i = 0; i <= C.MAX_LEVEL; i++)
            this.times[i] = 0;
    }
}