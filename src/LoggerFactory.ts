import { Appender } from "./Appender";
import { CallbackAppender } from "./CallbackAppender";
import { ConfigItem, LevelStrings } from "./ConfigItem";
import { Level } from "./Level";
import { Logger } from "./Logger";
import { PyroConfigItem } from "./PyroConfigItem";
import { PyroLogger } from "./PyroLogger";
import { Utils } from "./utils";
import { ConfigTree } from "./ConfigTree";
import { DEFAULT_CONFIG } from "./Const";

export class LoggerFactory {

    private _defLevel: Level;
    private _useDebug: boolean;
    private _writeFnc: boolean;
    private _config: ConfigTree | null;
    private _loggers: Map<string, PyroLogger>;
    private _appender: Appender | null;

    /**
     * constructs the instance
     */
    constructor() {
        this._defLevel = Level.INFO;
        this._useDebug = false;
        this._writeFnc = false;
        this._config = null;
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
        return this._useDebug;
    }

    /**
     * sets the "use console.debug()" flag
     */
    set useDebug(d: boolean) {
        this._useDebug = !!d;
    }

    /**
     * flag whether to write the name of the calling function / method along with each output
     * @returns {boolean} true if new loggers should write the function name along with each log output; false otherwise
     */
    get writeFnc(): boolean {
        return this._writeFnc;
    }

    /**
     * sets the "write function name" flag
     */
    set writeFnc(wf: boolean) {
        this._writeFnc = !!wf;
    }

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        if ( !this._loggers.has(Utils.ensureName(name)) ) {
            // time to create it
            this._loggers.set(name, new PyroLogger(name, this.getLevel(name), this.useDebug, this.getWriteFnc(name), this._appender));
        }
        return this._loggers.get(name) as Logger;
    }

    private _getConfig(name: string): ConfigItem | null {
        if ( this._config !== null ) {
            return this._config?.findConfig(name);
        } else {
            return null;
        }
    }

    /**
     * retrieves the configured level of a logger
     * @param name logger name
     * @returns the level for that logger; if no configuration exists for the specified logger then the default level is returned
     */
    getLevel(name: string): Level {
        const config = this._getConfig(name);
        return config !== null ? Level[config.level] : this._defLevel;
    }

    /**
     * retrieves the "write function name" flag for the specified logger
     * @param name logger name
     * @returns true if the specified logger should write the function name along with each log output; false otherwise
     */
    getWriteFnc(name: string): boolean {
        const config = this._getConfig(name);
        return config !== null ? config.writeFnc : this.writeFnc;
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
     * @param wf flag whether to write the name of the calling function / method
     * @returns the created configuration item
     */
    createConfigItem(name: string, level: LevelStrings, wf: boolean) : ConfigItem {
        return new PyroConfigItem(Utils.ensureName(name), level, wf);
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void {
        const cfg = ConfigTree.applyConfiguration(config)
        this._config = cfg;
        this._defLevel = Level[cfg.defaultConfig.level];
        this._writeFnc = cfg.defaultConfig.writeFnc;
        // TODO: update existing loggers
    }
}

const loggerFactory = new LoggerFactory();
