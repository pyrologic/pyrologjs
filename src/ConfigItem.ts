import { Level } from "./Level";

/**
 * a string collection of all supported logging levels
 */
export type LevelStrings = keyof typeof Level;

/**
 * configuration item
 */
export interface ConfigItem {
    /** logger name */
    readonly name: string;
    /** logging level */
    readonly level: LevelStrings;
    /** flag whether to write the name of the calling function / method along with each output */
    readonly writeFnc: boolean;
}