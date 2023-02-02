import { ConfigItem, LevelStrings } from "./ConfigItem";

export class PyroConfigItem implements ConfigItem {
    private readonly _name: string;
    private readonly _level: LevelStrings;
    private readonly _writeFnc: Boolean | null;

    constructor(name: string, level: LevelStrings, wf: Boolean | null) {
        this._name = name;
        this._level = level;
        this._writeFnc = wf;
        Object.freeze(this);
    }

    get name(): string {
        return this._name;
    }

    get level(): LevelStrings {
        return this._level;
    }

    get writeFnc(): Boolean | null {
        return this._writeFnc;
    }
}