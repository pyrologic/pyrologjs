import { Level } from "./Level";
import { Logger } from "./Logger";
import { PLogger } from "./Plogger";

export class LoggerFactory {

    private loggers: Map<string, Logger>;

    /**
     * constructs the instance
     */
    constructor() {
        this.loggers = new Map();
    }

    static getInstance() {
        return loggerFactory;
    }

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        if ( !this.loggers.has(name) ) {
            // time to create it
            this.loggers.set(name, new PLogger(name, Level.INFO));
        }
        return this.loggers.get(name);
    }
}

const loggerFactory = new LoggerFactory();
