import { Appender } from "./Appender";
import { CallbackAppender } from "./CallbackAppender";
import { ConfigItem, LevelStrings } from "./ConfigItem";
import { Level } from "./Level";
import { Logger } from "./Logger";
import { PyroConfigItem } from "./PyroConfigItem";
import { PyroLogger } from "./PyroLogger";
import { Utils } from "./utils";

const DEFAULT_CONFIG = '@default';

export class LoggerFactory {

    private _defLevel: Level;
    private _usedbg: boolean;
    private _config: Map<string, Level>;
    private _loggers: Map<string, PyroLogger>;
    private _appender: Appender | null;

    /**
     * constructs the instance
     */
    constructor() {
        this._defLevel = Level.INFO;
        this._usedbg = false;
        this._config = new Map();
        this._loggers = new Map();
        this._appender = null;
    }

    /**
     * returns the logger factory instance
     * @returns {LoggerFactory} the logger factory instance
     */
    static getInstance() : LoggerFactory {
        return loggerFactory;
    }

    /**
     * the name of the default configuration item
     */
    get defaultName(): string {
        return DEFAULT_CONFIG;
    }

    /**
     * the default level for new loggers
     */
    get defaultLevel() : Level {
        return this._defLevel;
    }

    /**
     * sets the default level
     */
    set defaultLevel(l: Level) {
        this._defLevel = l;
    }

    /**
     * use console.debug()
     * @returns {boolean} true if DEBUG level and below should use console.debug(); false if console.log() should be used instead
     */
    get useDebug() : boolean {
        return this._usedbg;
    }

    /**
     * verifies whether the given name parameter is a valid string; throws an error if not
     * @param name a string specifying a name
     * @returns the given string
     */
    private _verifyName(name: unknown) : string {
        if ( !Utils.isString(name) ) {
            throw new Error(`Invalid name specified: "${name}" (type: ${typeof name})!`);
        }
        return name as string;
    }

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        if ( !this._loggers.has(this._verifyName(name)) ) {
            // time to create it
            this._loggers.set(name, new PyroLogger(name, this.getLevel(name), this._usedbg, this._appender));
        }
        return this._loggers.get(name) as Logger;
    }

    /**
     * checks whether a configuration for a logger exists
     * @param name logger name
     * @returns true if there's a configuration for the specified logger; false otherwise
     */
    hasConfig(name: string): Boolean {
        return this._config.has(this._verifyName(name));
    }

    /**
     * retrieves the configured level of a logger
     * @param name logger name
     * @returns the level for that logger; if no configuration exists for the specified logger then the default level is returned
     */
    getLevel(name: string): Level {
        return this._config.has(this._verifyName(name)) ? (this._config.get(name) as Level) : this._defLevel;
    }

    /**
     * creates a new callback appender
     * @param cf callback function
     * @param set flag whether to set this appender immediately
     * @returns the created appender
     */
    createAppender(cf: Function, set: boolean): Appender {
        const appender = new CallbackAppender(cf);
        if ( set ) {
            this.setAppender(appender);
        }
        return appender;
    }

    /**
     * sets a new appender
     * @param appender the new appender, may be null
     */
    setAppender(appender: Appender | null): void {
        this._appender = appender;
        this._loggers.forEach((l) => l.setAppender(appender));
    }

    /**
     * creates a configuration item
     * @param name logger name
     * @param level logging level
     * @returns the created configuration item
     */
    createConfigItem(name: string, level: LevelStrings) : ConfigItem {
        return new PyroConfigItem(this._verifyName(name), level);
    }

    /**
     * appplies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void {
        for ( let ci of config) {
            const name = this._verifyName(ci.name);
            const level = Level[ci.level];
            if ( typeof level === 'undefined' ) {
                throw new Error(`Invalid level "${ci.level}"!`);
            }
            if ( DEFAULT_CONFIG === name ) {
                // new default level
                this.defaultLevel = level;
            } else {
                // set level for a logger
                this._config.set(name, level);
                if ( this._loggers.has(name) ) {
                    (this._loggers.get(name) as PyroLogger).setLevel(level, this._usedbg);
                }
            }
        }
    }
}

const loggerFactory = new LoggerFactory();
