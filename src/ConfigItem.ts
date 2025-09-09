import { LevelStrings } from "./Level";
import { LevelStyles, StyleDef } from "./Styles";

/**
 * configuration item
 */
export interface ConfigItem {
    /** logger name */
    readonly name: string;
    /** logging level */
    readonly level: LevelStrings;
    /** flag whether to write the name of the calling function / method along with each output */
    readonly writeFnc: Boolean | null;
    /** level styles */
    readonly levelStyles: LevelStyles;

    /**
     * adds a level style definition or overrides an existing one
     * @param level the level 
     * @param style the style definition
     */
    addLevelStyle(level: LevelStrings, style: StyleDef): void;
}