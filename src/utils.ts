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
                if ( (index < 0) || ((s.length) - 1 < (index + 1)) ) {
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
}