import { ConfigItem } from "./ConfigItem";
import { Level } from "./Level";
import { Logger } from "./Logger";
import { PyroLogger } from "./PyroLogger";

const DEFAULT_CONFIG = '@default';

export class LoggerFactory {

    private _defLevel: Level;
    private _usedbg: boolean;
    private _config: Map<string, Level>;
    private _loggers: Map<string, PyroLogger>;

    /**
     * constructs the instance
     */
    constructor() {
        this._defLevel = Level.INFO;
        this._usedbg = false;
        this._config = new Map();
        this._loggers = new Map();
    }

    /**
     * returns the logger factory instance
     * @returns {LoggerFactory} the logger factory instance
     */
    static getInstance() : LoggerFactory {
        return loggerFactory;
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
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        if ( !this._loggers.has(name) ) {
            // time to create it
            this._loggers.set(name, new PyroLogger(name, this._defLevel, this._usedbg));
        }
        return this._loggers.get(name);
    }

    /**
     * checks whether a configuration for a logger exists
     * @param name logger name
     * @returns true if there's a configuration for the specified logger; false otherwise
     */
    hasConfig(name: string): Boolean {
        return this._config.has(name);
    }

    /**
     * retrieves the configured level of a logger
     * @param name logger name
     * @returns the level for that logger; if no configuration exists for the specified logger then the default level is returned
     */
    getLevel(name: string): Level {
        return this._config.has(name) ? this._config.get(name) : this._defLevel;
    }

    /**
     * appplies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void {
        for ( let ci of config) {
            const level = Level[ci.level];
            const name = ci.name;
            if ( DEFAULT_CONFIG === name ) {
                // new default level
                this.defaultLevel = level;
            } else {
                // set level for a logger
                this._config.set(name, level);
                if ( this._loggers.has(name) ) {
                    this._loggers.get(name).setLevel(level, this._usedbg);
                }
            }
        }
    }
}

const loggerFactory = new LoggerFactory();
