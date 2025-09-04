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
    ERROR,
    /** FATAL level */
    FATAL,
    /** loggers at this level do not log at all */
    OFF
}

/**
 * a string collection of all supported logging levels
 */
export type LevelStrings = keyof typeof Level;

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
        case Level.FATAL:
            return "FATAL";
        case Level.OFF:
            return "OFF";
    }
}

/**
 * converts a logging level into the matching level identifier
 * @param level the logging level
 * @returns the matching level identifier
 */
export function Level2LevelString(level: Level): LevelStrings {
    return Level2String(level) as LevelStrings;
}

/**
 * converts an arbitrary string into a valid level identifier
 * @param s arbitrary string
 * @returns the corresponding level identifier
 */
export function String2LevelString(s: string): LevelStrings {
    switch ( s ) {
        case "ALL":
            return "ALL";
        case "TRACE":
            return "TRACE";
        case "DEBUG":
            return "DEBUG";
        case "INFO":
            return "INFO";
        case "WARN":
            return "WARN";
        case "ERROR":
            return "ERROR";
        case "FATAL":
            return "FATAL";
        case "OFF":
            return "OFF";
        default:
            return "INFO";
    }
}

/**
 * converts a string providing a level name into the corresponding Level enumeration value
 * @param s string providing a level name
 * @returns the corresponding Level enumeration value
 */
export function String2Level(s: string): Level {
    const level = Level[String2LevelString(s)];
    return level !== undefined ? level : Level.INFO;
}

/**
 * executes a callback function for each logging level
 * @param f the callback function
 */
export function forEachLevel( f: (level: Level) => void ): void {
    for ( let l = Level.ALL ; l <= Level.OFF ; ++l ) {
        f(l);
    }
}
