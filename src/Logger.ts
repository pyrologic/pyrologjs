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
     * @param data data to be logged
     */
    writeLog(l: Level, ...data: any[]): void;

    /**
     * writes a log message at level TRACE
     * @param data data to be logged
     */
    trace(...data: any[]): void;

    /**
     * writes a log message at level DEBUG
     * @param data data to be logged
     */
    debug(...data: any[]): void;

    /**
     * writes a log message at level INFO
     * @param data data to be logged
     */
    info(...data: any[]): void;

    /**
     * writes a log message at level INFO
     * @param data data to be logged
     */
    warn(...data: any[]): void;
    
    /**
     * writes a log message at level INFO
     * @param data data to be logged
     */
    error(...data: any[]): void;
}