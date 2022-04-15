import { Level } from "./Level";
import { Logger } from "./Logger";

export class PLogger implements Logger {

    private _level: Level;
    private _name: string;

    /**
     * constructs a new instance
     * @param n logger name
     * @param l initial logging level
     */
    constructor(n: string, l: Level) {
        this._name = n;
        this._level = l;
    }

    get name(): string {
        return this._name;
    }

    get level(): Level {
        return this._level;
    };

    writeLog(l: Level, w: any): void {
        if ( l > this._level ) {
            console.log(w);
        }
    }
}