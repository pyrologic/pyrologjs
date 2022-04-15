/**
 * logging levels
 */
export enum Level {
    /** logs everything  */
    ALL,
    /** TRACE level */
    TRACE,
    /** DEBUG level */
    DEBUG,
    /** INFO level */
    INFO,
    /** WARN level */
    WARN,
    /** ERROR level */
    ERROR
}

/**
 * retrieves the name of a logging level
 * @param level logging level
 * @returns the corresponding name (string)
 */
export function Level2String(level: Level): string {
    switch ( level ) {
        case Level.ALL:
            return "ALL";
        case Level.TRACE:
            return "TRACE";
        case Level.DEBUG:
            return "DEBUG";
        case Level.INFO:
            return "INFO";
        case Level.WARN:
            return "WARN";
        case Level.ERROR:
            return "ERROR";
    }
}