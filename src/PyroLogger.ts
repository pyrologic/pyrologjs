import { Appender } from "./Appender";
import { Level, Level2String } from "./Level";
import { Logger } from "./Logger";

export class PyroLogger implements Logger {

    private _level: Level;
    private _name: string;
    private _usedbg: boolean;
    private _appender: Appender | null;

    /**
     * constructs a new instance
     * @param n logger name
     * @param l initial logging level
     * @param d flag whehter to use console.debug() for level DEBUG and below
     */
    constructor(n: string, l: Level, d: boolean, a: Appender | null) {
        this._name = n;
        this._level = l;
        this._usedbg = d;
        this._appender = a;
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
     * @param {boolean} d flag whehter to use console.debug() for level DEBUG and below
     */
    setLevel(l: Level, d: boolean): void {
        this._level = l;
        this._usedbg = d;
    }

    /**
     * sets a new appender
     * @param a the new appender; may be null
     */
    setAppender(a: Appender | null) {
        this._appender = a;
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
            const prefix = `${this._name} [${Level2String(l)}]:`;
            switch ( l ) {
                case Level.ALL:
                case Level.TRACE:
                case Level.DEBUG:
                    if ( this._usedbg ) {
                        console.debug(prefix, ...data);
                    } else {
                        console.log(prefix, ...data);
                    }
                    break;
                case Level.INFO:
                    console.info(prefix, ...data);
                    break;
                case Level.WARN:
                    console.warn(prefix, ...data);
                    break;
                case Level.ERROR:
                    console.error(prefix, ...data);
                    break;
                default:
                    console.log(prefix, ...data);
                    break;
            }
            if ( this._appender !== null ) {
                this._appender.appendLog(prefix, ...data);
            }
        }
    }

    /**
     * @override
     */
    trace(...data: any[]): void {
        this.writeLog(Level.TRACE, ...data);
    }

    /**
     * @override
     */
    debug(...data: any[]): void {
        this.writeLog(Level.DEBUG, ...data);
    }

    /**
     * @override
     */
    info(...data: any[]): void {
        this.writeLog(Level.INFO, ...data);
    }

    /**
     * @override
     */
    warn(...data: any[]): void {
        this.writeLog(Level.WARN, ...data);
    }

    /**
     * @override
     */
    error(...data: any[]): void {
        this.writeLog(Level.ERROR, ...data);
    }
}