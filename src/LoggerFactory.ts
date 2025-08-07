import { Appender } from "./Appender";
import { CallbackAppender } from "./CallbackAppender";
import { ConfigItem } from "./ConfigItem";
import { LevelStrings } from "./Level";
import { Level } from "./Level";
import { Logger } from "./Logger";
import { PyroConfigItem } from "./PyroConfigItem";
import { PyroLogger } from "./PyroLogger";
import { Utils } from "./utils";
import { ConfigTree } from "./ConfigTree";
import { DEFAULT_CONFIG } from "./Const";
import { PrefixGenerator } from "./PrefixGenerator";
import { PyroPrefixGenerator } from "./PyroPrefixGenerator";
import { CallbackPrefixGenerator } from "./CallbackPrefixGenerator";

export class LoggerFactory {

    private readonly _loggers: Map<string, PyroLogger>;
    private _defLevel: Level;
    private _writeFnc: Boolean | null;
    private _config: ConfigTree | null;
    private _appender: Appender | null;
    private _pfxGenerator: PrefixGenerator | null;

    /**
     * constructs the instance
     */
    constructor() {
        this._loggers = new Map();
        this._defLevel = Level.INFO;
        this._writeFnc = null;
        this._config = null;
        this._appender = null;
        this._pfxGenerator = null;
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
     * flag whether to write the name of the calling function / method along with each output
     * @returns {Boolean | null} true if new loggers should write the function name along with each log output; false if not; null if not specified
     */
    get writeFnc(): Boolean | null {
        return this._writeFnc;
    }

    /**
     * sets the "write function name" flag
     */
    set writeFnc(wf: Boolean | null) {
        this._writeFnc = wf;
    }

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        const path = Utils.normalizePath(name);
        if ( !this._loggers.has(path) ) {
            // time to create it
            this._loggers.set(path, new PyroLogger(path, this.getLevel(path), this._getEffWriteFnc(this.getWriteFnc(path)), this.prefixGenerator, this._appender));
        }
        return this._loggers.get(path) as Logger;
    }

    private _getConfig(name: string): ConfigItem | null {
        if ( this._config !== null ) {
            return this._config?.findConfig(name);
        } else {
            return null;
        }
    }

    private _getEffWriteFnc(wf: Boolean | null): boolean {
        return (wf !== null) ? wf.valueOf() : ((this._writeFnc !== null) ? this._writeFnc.valueOf() : false);
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
     * @returns true if the specified logger should write the function name along with each log output; false if not; null if not specified
     */
    getWriteFnc(name: string): Boolean | null {
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
     * sets a new prefix generator
     * @param generator new prefix generator
     */
    setPrefixGenerator(generator: PrefixGenerator | null): void {
        this._pfxGenerator = generator;
        const pg = this.prefixGenerator;
        this._loggers.forEach((l) => l.setPrefixGenerator(pg));
    }

    /**
     * creates a prefix generator
     * @param fn actual prefix generator function
     * @param set flag whether to set this prefix generator immediately as current prefix generator
     * @returns the created prefix generator instance
     */
    createPrefixGenerator(fn: (logger:Logger, level:Level) => string, set: boolean) : PrefixGenerator {
        const pg: PrefixGenerator = new CallbackPrefixGenerator(fn);
        if ( set ) {
            this.setPrefixGenerator(pg);
        }
        return pg;
    }

    get prefixGenerator(): PrefixGenerator {
        return this._pfxGenerator !== null ? this._pfxGenerator : PyroPrefixGenerator.getInstance();
    }

    /**
     * creates a configuration item
     * @param name logger name
     * @param level logging level
     * @param wf flag whether to write the name of the calling function / method
     * @returns the created configuration item
     */
    createConfigItem(name: string, level: LevelStrings, wf: Boolean | null) : ConfigItem {
        return new PyroConfigItem(Utils.normalizePath(name), level, wf);
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void {
        if ( this._config !== null ) {
            // drop old configuration
            this._config.clear();
            this._config = null;
        }
        // read and evaluate configuration items
        const cfg = ConfigTree.applyConfiguration(config)
        this._config = cfg;
        this._defLevel = Level[cfg.defaultConfig.level];
        this._writeFnc = cfg.defaultConfig.writeFnc;
        if ( this._loggers.size > 0 ) {
            // update existing loggers
            this._loggers.forEach((pl) => {
                pl.setLevel(this.getLevel(pl.name));
                pl.setWriteFnc(this._getEffWriteFnc(this.getWriteFnc(pl.name)));
            });
        }
    }
}

const loggerFactory = new LoggerFactory();
