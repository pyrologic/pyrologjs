import { Level } from "./Level";
import { ConfigItem, LevelStrings } from "./ConfigItem";
import { Logger } from "./Logger";
import { LoggerFactory } from "./LoggerFactory";

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
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string) : Logger {
        return this._lf.getLogger(name);
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
}

const pyroLog = PyroLog._create();

export { ConfigItem, Logger, PyroLog };