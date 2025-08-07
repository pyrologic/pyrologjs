import { LevelStrings } from "./Level";

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
}