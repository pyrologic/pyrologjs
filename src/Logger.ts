import { Level } from "./Level";
import { StyleDef } from "./Styles";

/**
 * the main logger interface
 */
export interface Logger {

    /** logger name */
    readonly name: string;
    /** logging level of this instance */
    readonly level: Level;
    /** "write function name" flag */
    readonly writeFnc: boolean;
    /** the offset for the call stack used to get the name of the calling function */
    readonly fncOffset: number;
    /** the current "suspended" state of this logger */
    readonly suspended: boolean;

    /**
     * checks whether this logger is enabled for a specific logging level
     * @param l logging level
     * @returns true if this logger is enabled for the specified logging level; false otherwise
     */
    isEnabledFor(l: Level): boolean;

    /**
     * @returns true if this logger is enabled for logging at level DEBUG or above; false otherwise
     */
    isDebugEnabled(): boolean;

    /**
     * @returns true if this logger is enabled for logging at level TRACE or above; false otherwise
     */
    isTraceEnabled(): boolean;

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
     * writes a log message at level WARN
     * @param data data to be logged
     */
    warn(...data: any[]): void;
    
    /**
     * writes a log message at level ERROR
     * @param data data to be logged
     */
    error(...data: any[]): void;

    /**
     * writes a log message at level FATAL
     * @param data data to be logged
     */
    fatal(...data: any[]): void;

    /**
     * logs the current stack trace
     * @param l logging level
     * @param skip number of stack entries to skip
     * @param message optional message text
     */
    writeStackTrace(l: Level, skip: number, message?: string): void;

    /**
     * sets an offset for the call stack used to get the name of the calling function
     * @param offs the offset use to get the name of the calling function
     */
    setFncOffset(offs: number): void;

    /**
     * sets the "suspended" state for this logger
     * @param suspended the "suspended" state for this logger
     */
    setSuspended(suspended: boolean): void;

    /**
     * adds a style definition for a logging level
     * @param level the logging level
     * @param style the style definition for this level
     */
    addStyle(level: Level, style: StyleDef): void;
}