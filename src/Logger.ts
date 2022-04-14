import { Level } from "./Level";

/**
 * the main logger interface
 */
export interface Logger {

    /** logging level of this instance */
    readonly level: Level;

}