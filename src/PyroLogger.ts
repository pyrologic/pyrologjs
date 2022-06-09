import { Appender } from "./Appender";
import { Level, Level2String } from "./Level";
import { Logger } from "./Logger";
import { Utils } from "./utils";

export class PyroLogger implements Logger {

    private _level: Level;
    private _name: string;
    private _useDebug: boolean;
    private _writeFnc: boolean;
    private _appender: Appender | null;

    /**
     * constructs a new instance
     * @param n logger name
     * @param l initial logging level
     * @param d flag whether to use console.debug() for level DEBUG and below
     * @param wf flag whether to write the name of the calling function / method
     * @param a the optional appender
     */
    constructor(n: string, l: Level, d: boolean, wf: boolean, a: Appender | null) {
        this._name = n;
        this._level = l;
        this._useDebug = !!d;
        this._writeFnc = !!wf;
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
     * @param {boolean} d flag whether to use console.debug() for level DEBUG and below
     */
    setLevel(l: Level, d: boolean): void {
        this._level = l;
        this._useDebug = d;
    }

    /**
     * sets a new appender
     * @param a the new appender; may be null
     */
    setAppender(a: Appender | null) {
        this._appender = a;
    }

    /**
     * sets the flag whether to write the name of the calling function / method along with each logging output
     * @param wf new value
     */
    setWriteFnc(wf: boolean): void {
        this._writeFnc = !!wf;
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
    isEnabledFor(l: Level): boolean {
        return l >= this.level;        
    }

    /**
     * @override
     */
    isDebugEnabled(): boolean {
        return this.isEnabledFor(Level.DEBUG);
    }

    /**
     * @override
     */
    writeLog(l: Level, ...data: any[]): void {
        if ( (this._level !== Level.OFF) && (l !== Level.OFF) && this.isEnabledFor(l) ) {
            const prefix = `${this._name} [${Level2String(l)}]` + (this._writeFnc ? ` (${Utils.getFunctionName(2)})` : '') + ':';
            switch ( l ) {
                case Level.ALL:
                case Level.TRACE:
                case Level.DEBUG:
                    if ( this._useDebug ) {
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

    /**
     * @override
     */
    writeStackTrace(l: Level, skip: number, message?: string): void {
        if ( this.isEnabledFor(l) ) {
            this.writeLog(l, (Utils.isString(message) ? message as string : '') + '\n' + Utils.getStack(skip));
        }
    }
}