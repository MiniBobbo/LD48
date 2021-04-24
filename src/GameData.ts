import { C } from "./C";

export class GameData {
    flags:Array<boolean>;

    constructor() {
        this.flags = [];
        for(let i = 0; i < C.FLAG_COUNT; i++)
            this.flags.push(false);
    }
}