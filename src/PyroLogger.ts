import { Level, Level2String } from "./Level";
import { Logger } from "./Logger";

export class PyroLogger implements Logger {

    private _level: Level;
    private _name: string;

    /**
     * constructs a new instance
     * @param n logger name
     * @param l initial logging level
     */
    constructor(n: string, l: Level) {
        this._name = n;
        this._level = l;
    }

    /**
     * @returns the name of this logger
     */
    get name(): string {
        return this._name;
    }

    /**
     * @returns {Level} the current logging level of this logger
     */
    get level(): Level {
        return this._level;
    };

    /**
     * sets a new logging level of this logger
     * @param {Level} l new logging level of this logger
     */
    setLevel(l: Level): void {
        this._level = l;
    }

    /**
     * @returns {String} a short informational string about this logger
     */
    toString(): string {
        return `{Logger "${this._name}" [${Level2String(this._level)}]}`;
    }

    /**
     * @override
     */
    writeLog(l: Level, ...data: any[]): void {
        if ( (this._level !== Level.OFF) && (l !== Level.OFF) && (l >= this._level) ) {
            const prefix = `${this._name} [${Level2String(l)}]: `;
            switch ( l ) {
                case Level.ALL:
                case Level.TRACE:
                case Level.DEBUG:
                    console.debug(prefix, data);
                    break;
                case Level.INFO:
                    console.info(prefix, data);
                    break;
                case Level.WARN:
                    console.warn(prefix, data);
                    break;
                case Level.ERROR:
                    console.error(prefix, data);
                    break;
                default:
                    console.log(prefix, data);
                    break;
            }
        }
    }

    /**
     * @override
     */
    trace(...data: any[]): void {
        this.writeLog(Level.TRACE, data);
    }

    /**
     * @override
     */
    debug(...data: any[]): void {
        this.writeLog(Level.DEBUG, data);
    }

    /**
     * @override
     */
    info(...data: any[]): void {
        this.writeLog(Level.INFO, data);
    }

    /**
     * @override
     */
    warn(...data: any[]): void {
        this.writeLog(Level.WARN, data);
    }

    /**
     * @override
     */
    error(...data: any[]): void {
        this.writeLog(Level.ERROR, data);
    }
}