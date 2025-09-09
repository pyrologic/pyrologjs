/**
 * general utility class
 */
export class Utils {

    private static _can_console_styles: boolean | undefined = undefined;

    /**
     * indicates whether styled console output is possible 
     * @returns true if styled console output is possible; false otherwise
     */
    static canConsoleStyles(): boolean {
        if ( Utils._can_console_styles === undefined) {
            let webkit: boolean = false;
            let nodejs: boolean = false;
            try {
                // check for WebKit / Chromium based browser
                webkit = typeof navigator !== "undefined" && !!(navigator.userAgent) && navigator.userAgent.includes("AppleWebKit");
            } catch ( e ) {
                webkit = false;
            }
            if ( !webkit ) {
                // check for nodejs / deno
                try {
                    nodejs = typeof process !== "undefined";
                } catch ( e ) {
                    nodejs = false;
                }
            }
            Utils._can_console_styles = nodejs || webkit;
        }
        return Utils._can_console_styles;
    }

    /**
     * checks whether the specified object is a real, non-empty string
     * @param str the object supposed to be a string
     * @returns true if the given object is a non-empty string; false other wise
     */
    static isString(str: unknown): boolean {
        return (typeof str === 'string') && (str.length > 0);
    }

    /**
     * ensures that a string is returned
     * @param str the object supposed to be a string
     * @returns the given string if it is a valid string; an empty string otherwise
     */
    static ensureString(str: unknown): string {
        return Utils.isString(str) ? (str as string) : '';
    }

    /**
     * checks whether the given name parameter is a valid string; throws an error if not
     * @param name a string specifying a name
     * @returns the given string
     */
    static ensureName(name: unknown) : string {
        if ( !Utils.isString(name) ) {
            throw new Error(`Invalid name specified: "${name}" (type: ${typeof name})!`);
        }
        return name as string;
    }

    /**
     * checks whether all elements of the given array are valid strings; throws an error if not
     * @param names array of strings to be 
     * @param errmsg optional error message that's thrown in the case of an error
     */
    static checkNames(names: any[], errmsg: string=""): string[] {
        const cnt = names.length;
        for ( let i=0 ; i < cnt ; ++i ) {
            const n = names[i];
            if ( !Utils.isString(n) ) {
                const msg = Utils.isString(errmsg) ? errmsg : `Invalid element at index #${i}: "${n}"!`;
                throw new Error(msg);
            }
        }
        return names as string[];
    }

    /**
     * splits a path string into parts
     * @param path the path string
     * @returns {string[]} the configuration path
     */
    static splitPath(path: string): string[] {
        const p: string[] = [];
        path.split('.').forEach((s) => p.push(s.trim()));
        return p;
    }

    /**
     * splits a logger name into a configuration path
     * @param {string} name logger name 
     * @returns {string[]} the configuration path
     */
    static getPath(name: string): string[] {
        return Utils.checkNames(Utils.splitPath(name), `Invalid logger path "${name}"!`);
    }

    /**
     * normalizes a logger name or path
     * @param name the logger name or path
     * @returns the normalized logger path
     */
    static normalizePath(name: string): string {
        const path = Utils.getPath(name);
        return path.join('.');
    }

    /**
     * retrieves the stack trace
     * @param skip number of stack entries to skip
     * @returns the stack trace as string
     */
    static getStack( skip = 1 ): string {
        const err = new Error();
        const stack = Utils.ensureString(err.stack);
        if ( Utils.isString(stack) ) {
            let s = stack as string;
            let c = skip;
            if ( !stack.startsWith('Error') ) {
                // Chromium has an additional line beginning with "Error\n" - Firefox and Safari do not!
                --c;
            }
            while ( c >= 0 ) {
                const index = s.indexOf('\n');
                if ( (index < 0) || ((s.length - 1) < (index + 1)) ) {
                    break;
                }
                s = s.substring(index + 1);
                --c;
            }
            return s;
        } else {
            return '';
        }
    }

    /**
     * retrieves the name of the calling function
     * @param skip number of stack entries to skip; 0 used default
     * @param separator optional separator character that replaces '.'
     * @returns the name of the calling function
     */
    static getFunctionName(skip = 0, separator = '#') : string {
        const eff_skip = (typeof skip === 'number') ? skip + 2 : 2;
        const stack = Utils.getStack(eff_skip);
        if ( Utils.isString(stack) ) {
            let s = (stack as string).trim();
            if ( s.startsWith('at ') ) {
                s = s.substring(3);
            }
            const si = s.indexOf(' (');
            if ( (si !== -1) && ((si + 1) < (s.length - 1)) ) {
                s = s.substring(0, si);
            }
            const ai = s.indexOf('@');
            if ( (ai >= 0) && ((s.length - 1) >= (ai + 1)) ) {
                s = s.substring(0, ai);
            }
            const pi = s.indexOf('/<');     // that's sometimes the case in Firefox
            if ( pi !== -1 ) {
                s = s.substring(0, pi);
            }
            let hi = s.indexOf('https://');
            if ( hi === -1 ) {
                hi = s.indexOf('http://');
            }
            if ( hi !== -1 ) {
                s = (hi > 0) ? s.substring(0, hi) : '<anonymous>';
            }
            if ( (s.length > 0) && Utils.isString(separator) ) {
                s = s.replace('.', separator);
            }
            return s;
        } else {
            return '';
        }
    }
}