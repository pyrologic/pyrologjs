import { Level } from "./Level";
import { ConfigItem, LevelStrings } from "./ConfigItem";
import { Logger } from "./Logger";
import { LoggerFactory } from "./LoggerFactory";
import { Appender } from "./Appender";
import { Utils } from "./utils";

class PyroLog {

    private _lf: LoggerFactory;

    private constructor() {
        this._lf = LoggerFactory.getInstance();
        Object.freeze(this);
    }

    static _create(): PyroLog {
        return new PyroLog();
    }

    /**
     * returns the singleton instance
     * @returns the singleton instance
     */
    static getInstance(): PyroLog {
        return pyroLog;
    }

    /**
     * the logger factory instance
     */
    get Factory(): LoggerFactory {
        return this._lf;
    }

    /**
     * the name of the default configuration item
     */
    get defaultName(): string {
        return this._lf.defaultName;
    }

    /**
     * the default level for new loggers
     */
    get defaultLevel() : Level {
        return this._lf.defaultLevel;
    }

    /**
     * the stack trace as string
     */
    get stackTrace(): string {
        return Utils.getStack(2);
    }

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        return this._lf.getLogger(name);
    }

    /**
     * creates a new callback appender
     * @param cf callback function
     * @param set flag whether to set this appender immediately
     * @returns the created appender
     */
    createAppender(cf: Function, set: boolean): Appender {
        return this._lf.createAppender(cf, set);
    }

    /**
     * sets a new appender
     * @param appender the new appender, may be null
     */
    setAppender(appender: Appender | null): void {
        this._lf.setAppender(appender);
    }

    /**
     * creates a configuration item
     * @param name logger name
     * @param level logging level
     * @returns the created configuration item
     */
    createConfigItem(name: string, level: LevelStrings) : ConfigItem {
        return this._lf.createConfigItem(name, level);
    }

    /**
     * appplies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void {
        this._lf.applyConfiguration(config);
    }

    /**
     * writes the current stack trace to the specified logger
     * @param logger target logger
     * @param level logging level
     * @param message optional message text
     */
    writeStackTrace(logger: Logger, level: LevelStrings, message?: string) {
        logger.writeStackTrace(Level[level], 3, message);
    }
}

// create the singleton instance
const pyroLog = PyroLog._create();

// create Level enumeration as JS object
const JsLevel = Object.freeze({
    ALL: Level.ALL,
    TRACE: Level.TRACE,
    DEBUG: Level.DEBUG,
    INFO: Level.INFO,
    WARN: Level.WARN,
    ERROR: Level.ERROR,
    OFF: Level.OFF
});

// export everything that should be exported
export { Appender, ConfigItem, Logger, PyroLog, Level, JsLevel };
