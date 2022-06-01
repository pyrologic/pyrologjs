import { ConfigItem, LevelStrings } from "./ConfigItem";

export class PyroConfigItem implements ConfigItem {
    private _name: string;
    private _level: LevelStrings;

    constructor(name: string, level: LevelStrings) {
        this._name = name;
        this._level = level;
        Object.freeze(this);
    }

    get name(): string {
        return this._name;
    }

    get level(): LevelStrings {
        return this._level;
    }
}