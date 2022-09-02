export class GlobalOptions {

    private _useDebug: boolean;
    private _suspended: boolean;

    /**
     * constructs a new instance
     */
    constructor() {
        this._useDebug = false;
        this._suspended = false;
    }

    /**
     * 
     * @returns the singleton instance
     */
    static getInstance(): GlobalOptions {
        return globalOptions;
    }

    /**
     * use console.debug()
     * @returns {boolean} true if DEBUG level and below should use console.debug(); false if console.log() should be used instead
     */
     get useDebug() : boolean {
        return this._useDebug;
    }

    /**
     * sets the "use console.debug()" flag
     */
    set useDebug(d: boolean) {
        this._useDebug = !!d;
    }

    /**
     * @returns {boolean} true if logging is currently suspended; false otherwise
     */
    get suspended() : boolean {
        return this._suspended;
    }

    /**
     * sets the "suspended" flag
     */
    set suspended(s: boolean) {
        this._suspended = s;
    }

    /**
     * sets global options
     * @param o an object providing one or more global options
     */
    setOptions(o: any): void {
        if ( typeof o === 'object' ) {
            if ( ('useDebug' in o) && (typeof o.useDebug === 'boolean') ) {
                this._useDebug = !!o.useDebug;
            }
            if ( ('suspended' in o) && (typeof o.suspended === 'boolean') ) {
                this._suspended = !!o.suspended;
            }
        }
    }
}

const globalOptions: GlobalOptions = new GlobalOptions();