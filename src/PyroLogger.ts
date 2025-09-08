import { Appender } from "./Appender";
import { GlobalOptions } from "./GlobalOptions";
import { forEachLevel, Level, Level2String } from "./Level";
import { Logger } from "./Logger";
import { PrefixGenerator } from "./PrefixGenerator";
import { StyleProvider } from "./StyleProvider";
import { Colors, StyleDef } from "./Styles";
import { Utils } from "./utils";

export class PyroLogger implements Logger {

    private readonly _options: GlobalOptions;
    private readonly _styles: Map<Level, StyleDef>;
    private readonly _styleProvider: StyleProvider;
    private _level: Level;
    private _name: string;
    private _writeFnc: boolean;
    private _fncOffset: number;
    private _suspended: boolean;
    private _pfxGenerator: PrefixGenerator;
    private _appender: Appender | null;

    /**
     * constructs a new instance
     * @param n logger name
     * @param l initial logging level
     * @param wf flag whether to write the name of the calling function / method
     * @param a the optional appender
     */
    constructor(n: string, l: Level, wf: boolean, pg: PrefixGenerator, sp: StyleProvider, a: Appender | null) {
        this._styleProvider = sp;
        this._options = GlobalOptions.getInstance();
        this._styles = new Map<Level, StyleDef>();
        this._name = n;
        this._level = l;
        this._writeFnc = !!wf;
        this._fncOffset = 0;
        this._suspended = false;
        this._pfxGenerator = pg;
        this._appender = a;
        this.updateStyles();
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
     * @returns the flag whether to write the name of the calling function / method along with each logging output
     */
    get writeFnc(): boolean {
        return this._writeFnc;
    }

    /**
     * @returns the offset for the call stack used to get the name of the calling function
     */
    get fncOffset(): number {
        return this._fncOffset;
    }

    /**
     * @returns the "suspended" state of this logger
     */
    get suspended(): boolean {
        return this._suspended;
    }

    /**
     * sets a new logging level of this logger
     * @param {Level} l new logging level of this logger
     */
    setLevel(l: Level): void {
        this._level = l;
    }

    /**
     * sets a new appender
     * @param a the new appender; may be null
     */
    setAppender(a: Appender | null) {
        this._appender = a;
    }

    /**
     * sets a new prefix generator
     * @param pg the new prefix generator; must not be null
     */
    setPrefixGenerator(pg: PrefixGenerator) {
        this._pfxGenerator = pg;
    }

    /**
     * sets the flag whether to write the name of the calling function / method along with each logging output
     * @param wf new value
     */
    setWriteFnc(wf: boolean): void {
        this._writeFnc = !!wf;
    }

    /**
     * updates the style definitions for this logger
     */
    updateStyles() : void {
        this._styles.clear();
        const styleProvider = this._styleProvider;
        const self = this;
        forEachLevel((level) => {
            const sd = styleProvider.getStyleDef(self.name, level);
            if ( sd !== undefined ) {
                self._styles.set(level, sd);
            }
        })
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
        return !this._options.suspended && (l >= this.level) && (l !== Level.OFF);
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
    isTraceEnabled(): boolean {
        return this.isEnabledFor(Level.TRACE);
    }

    /**
     * creates the prefix text that's prepended to each logging output
     * @param l logging level
     * @returns the prefix text
     */
    private _getPrefix(l: Level): string {
        try {
            this._fncOffset += 4;
            return this._pfxGenerator.createPrefix(this, l);
        } finally {
            this._fncOffset -= 4;
        }
    }

    /**
     * @returns true if this logger is currently suspended; false otherwise
     */
    private get _isSuspended(): boolean {
        return this.suspended || this._options.suspended;
    }

    /**
     * adds a style value to the given style descriptor
     * @param dsc the current style descriptor
     * @param value the style value
     * @returns the new style descriptor
     */
    private _addStyleDsc(dsc: string, value: number): string {
        return `${dsc}${dsc.length ? ';' : ''}${value}`;
    }

    /**
     * creates a style descriptor from a style definition
     * @param style the style definition
     * @returns the style descriptor
     */
    private _createStyleDescriptor(style: StyleDef): string {
        let dsc = '';
        if ( Utils.canConsoleStyles() ) {
            // the environment supports this
            if ( style.color && style.color !== Colors.NONE ) {
                dsc = this._addStyleDsc(dsc, style.color.fgRef);
            }
            if ( style.background && style.background !== Colors.NONE ) {
                dsc = this._addStyleDsc(dsc, style.background.bgRef);
            }
            if ( style.styles.bold ) {
                dsc = this._addStyleDsc(dsc, 1);
            }
            if ( style.styles.italic ) {
                dsc = this._addStyleDsc(dsc, 3);
            }
            if ( style.styles.underline ) {
                dsc = this._addStyleDsc(dsc, 4);
            }
            if ( style.styles.linethrough ) {
                dsc = this._addStyleDsc(dsc, 9);
            }
        }
        return dsc;
    }

    /**
     * applies the style definition to the data to be logged
     * @param style the style definition
     * @param prefix the prefix text
     * @param data data to be logged
     * @returns the styled data to be logged
     */
    private _applyStyle(style: StyleDef | undefined, prefix: string, data: any[]): any[] {
        if ( style !== undefined ) {
            const dsc = this._createStyleDescriptor(style);
            if ( Utils.isString(dsc) ) {
                // we've got a valid, non-empty style descriptor
                const styled_data: any[] = [];
                let text: string = `\x1B[${dsc}m`;
                // add prefix text if present
                if ( Utils.isString(prefix) ) {
                    text += `${prefix} `;
                }
                // add placeholders for each value according to its type
                for ( let i=0 ; i < data.length ; ++i ) {
                    if ( i > 0 ) {
                        text += ' ';
                    }
                    const value: any = data[i];
                    if ( Utils.isString(value) ) {
                        text += '%s';
                    } else if ( typeof value === 'number' ) {
                        text += Number.isInteger(value) ? '%d' : '%f';
                    } else if ( value instanceof HTMLElement ) {
                        text += '%o';
                    } else {
                        text += '%O';
                    }
                }
                // reset formatting
                text += '\x1B[0m';
                // first item is the prefix text with styling and all placeholders
                styled_data.push(text);
                // all other items are the actual data to be logged
                styled_data.push(...data);
                // done
                return styled_data;
            }
        }
        // use data "as is" but consider the prefix
        if ( Utils.isString(prefix) ) {
            const all_data: any[] = [];
            all_data.push(prefix, ...data);
            return all_data;
        } else {
            // no prefix, nothing to do
            return data;
        }
    }

    /**
     * @override
     */
    writeLog(l: Level, ...data: any[]): void {
        if ( !this._isSuspended && (this._level !== Level.OFF) && (l !== Level.OFF) && this.isEnabledFor(l) ) {
            const prefix = this._getPrefix(l);
            const style = this._styles.get(l);
            const styled_data = this._applyStyle(style, prefix, data);
            switch ( l ) {
                case Level.ALL:
                case Level.TRACE:
                case Level.DEBUG:
                    if ( this._options.useDebug ) {
                        console.debug(...styled_data);
                    } else {
                        console.log(...styled_data);
                    }
                    break;
                case Level.INFO:
                    console.info(...styled_data);
                    break;
                case Level.WARN:
                    console.warn(...styled_data);
                    break;
                case Level.ERROR:
                case Level.FATAL:
                    console.error(...styled_data);
                    break;
                default:
                    console.log(...styled_data);
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
    fatal(...data: any[]): void {
        this.writeLog(Level.FATAL, ...data);       
    }

    /**
     * @override
     */
    writeStackTrace(l: Level, skip: number, message?: string): void {
        if ( this.isEnabledFor(l) ) {
            this.writeLog(l, (Utils.isString(message) ? message as string : '') + '\n' + Utils.getStack(skip));
        }
    }

    /**
     * @override
     */
    setFncOffset(offs: number): void {
        this._fncOffset = offs;
    }

    /**
     * @override
     */
    setSuspended(suspended: boolean): void {
        this._suspended = suspended;
    }

    /**
     * @override
     */
    addStyle(level: Level, style: StyleDef): void {
        this._styles.set(level, style);
    }
}