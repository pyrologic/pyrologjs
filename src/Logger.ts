import { Level } from "./Level";

/**
 * the main logger interface
 */
export interface Logger {

    /** logger name */
    readonly name: string;
    /** logging level of this instance */
    readonly level: Level;

    /**
     * writes a log message at the specified level
     * @param l logging level
     * @param w object to be logged
     */
    writeLog(l: Level, w: any): void;
}