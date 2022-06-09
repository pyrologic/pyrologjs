/**
 * general utility class
 */
export class Utils {

    /**
     * checks whether the specified object is a real, non-empty string
     * @param str the object supposed to be a string
     * @returns true if the given object is a non-empty string; false other wise
     */
    static isString(str: unknown): boolean {
        return (typeof str === 'string') && (str.length > 0);
    }

    /**
     * retrieves the stack trace
     * @param skip number of stack entries to skip
     * @returns the stack trace as string
     */
    static getStack( skip = 1 ): string {
        const err = new Error();
        const stack = err.stack;
        if ( Utils.isString(stack) ) {
            let s = stack as string;
            let c = skip;
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
            const si = s.indexOf(' ');
            if ( (si < 0) || ((s.length - 1) < (si + 1)) ) {
                return s;
            }
            s = s.substring(0, si);
            const ai = s.indexOf('@');
            if ( (ai >= 0) && ((s.length - 1) >= (ai + 1)) ) {
                s = s.substring(0, ai);
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