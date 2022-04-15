import { ConfigItem } from "./ConfigItem";
import { Level } from "./Level";
import { Logger } from "./Logger";
import { PyroLogger } from "./PyroLogger";

export class LoggerFactory {

    private _defLevel: Level;
    private _cfg: Map<string, Level>;
    private _loggers: Map<string, PyroLogger>;

    /**
     * constructs the instance
     */
    constructor() {
        this._defLevel = Level.INFO;
        this._cfg = new Map();
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
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        if ( !this._loggers.has(name) ) {
            // time to create it
            this._loggers.set(name, new PyroLogger(name, this._defLevel));
        }
        return this._loggers.get(name);
    }

    hasConfig(name: string): Boolean {
        return this._cfg.has(name);
    }

    getLevel(name: string): Level {
        return this._cfg.has(name) ? this._cfg.get(name) : this._defLevel;
    }

    applyConfiguration(config: ConfigItem[]): void {
        for ( let ci of config) {
            const level = Level[ci.level];
            const name = ci.name;
            this._cfg.set(name, level);
            if ( this._loggers.has(name) ) {
                this._loggers.get(name).setLevel(level);
            }
        }
    }
}

const loggerFactory = new LoggerFactory();
