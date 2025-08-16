import { ConfigItem } from "./ConfigItem";
import { LevelStrings } from "./Level";
import { LevelStyles, StyleDef } from "./Styles";

export class PyroConfigItem implements ConfigItem {
    private readonly _name: string;
    private readonly _level: LevelStrings;
    private readonly _writeFnc: Boolean | null;
    private readonly _levelStyles: LevelStyles;

    constructor(name: string, level: LevelStrings, wf: Boolean | null) {
        this._name = name;
        this._level = level;
        this._writeFnc = wf;
        this._levelStyles = new Map<LevelStrings, StyleDef>();
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

    get levelStyles(): LevelStyles {
        return this._levelStyles;
    }

    /**
     * @inheritdoc
     * @override
     */
    addLevelStyle(level: LevelStrings, style: StyleDef): void {
        this._levelStyles.set(level, style);
    }
}