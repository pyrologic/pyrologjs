import { Level } from "./Level";
import { Logger } from "./Logger";
import { PyroLogger } from "./PyroLogger";

export class LoggerFactory {

    private _defLevel: Level;
    private _loggers: Map<string, Logger>;

    /**
     * constructs the instance
     */
    constructor() {
        this._defLevel = Level.INFO;
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
}

const loggerFactory = new LoggerFactory();
