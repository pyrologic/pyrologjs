/**
 * logging levels
 *
 * Ascending threshold order: a message is written only if its level is
 * numerically greater than or equal to the logger's configured level.
 *
 * This is a plain, frozen object (not a TS `enum`) so it is directly usable
 * from plain JavaScript consumers while keeping the numeric values that the
 * level gating relies on. The values are intentionally kept identical to the
 * former `enum Level` (ALL = 0 … OFF = 7).
 */
export const Level = Object.freeze({
    /** logs everything  */
    ALL: 0,
    /** TRACE level */
    TRACE: 1,
    /** DEBUG level */
    DEBUG: 2,
    /** INFO level */
    INFO: 3,
    /** WARN level */
    WARN: 4,
    /** ERROR level */
    ERROR: 5,
    /** FATAL level */
    FATAL: 6,
    /** loggers at this level do not log at all */
    OFF: 7
} as const);

/**
 * a logging level value (0…7); the ordinal is significant (see {@link Level})
 */
export type Level = typeof Level[keyof typeof Level];

/**
 * a string collection of all supported logging levels
 */
export type LevelStrings = keyof typeof Level;

/**
 * frozen mapping from level value back to its name (reverse of {@link Level})
 */
const LevelNames = Object.freeze(
    Object.fromEntries(
        Object.entries(Level).map(([name, value]) => [value, name])
    ) as Record<Level, LevelStrings>
);

/**
 * retrieves the name of a logging level
 * @param level logging level
 * @returns the corresponding name (string)
 */
export function Level2String(level: Level): string {
    return LevelNames[level];
}

/**
 * converts a logging level into the matching level identifier
 * @param level the logging level
 * @returns the matching level identifier
 */
export function Level2LevelString(level: Level): LevelStrings {
    return LevelNames[level];
}

/**
 * checks whether an arbitrary string is a valid level identifier
 * @param s arbitrary string
 * @returns true if `s` names a logging level; false otherwise
 */
export function isLevelString(s: string): s is LevelStrings {
    return Object.prototype.hasOwnProperty.call(Level, s);
}

/**
 * converts an arbitrary string into a valid level identifier
 * @param s arbitrary string
 * @returns the corresponding level identifier, or "INFO" if `s` is not a level name
 */
export function String2LevelString(s: string): LevelStrings {
    return isLevelString(s) ? s : "INFO";
}

/**
 * converts a string providing a level name into the corresponding Level value
 * @param s string providing a level name
 * @returns the corresponding Level value, or Level.INFO if `s` is not a level name
 */
export function String2Level(s: string): Level {
    return Level[String2LevelString(s)];
}

/**
 * executes a callback function for each logging level
 * @param f the callback function
 */
export function forEachLevel( f: (level: Level) => void ): void {
    for ( let l = Level.ALL ; l <= Level.OFF ; ++l ) {
        f(l as Level);
    }
}
