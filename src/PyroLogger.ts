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

    get name(): string {
        return this._name;
    }

    get level(): Level {
        return this._level;
    };

    setLevel(l: Level): void {

    }

    writeLog(l: Level, ...data: any[]): void {
        if ( l >= this._level ) {
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

    trace(...data: any[]): void {
        this.writeLog(Level.TRACE, data);
    }

    debug(...data: any[]): void {
        this.writeLog(Level.DEBUG, data);
    }

    info(...data: any[]): void {
        this.writeLog(Level.INFO, data);
    }

    warn(...data: any[]): void {
        this.writeLog(Level.WARN, data);
    }

    error(...data: any[]): void {
        this.writeLog(Level.ERROR, data);
    }
}