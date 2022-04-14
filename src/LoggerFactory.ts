import { Logger } from "./Logger";

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
    getLogger(name: string) {
        return this.loggers.get(name);
    }
}

const loggerFactory = new LoggerFactory();
