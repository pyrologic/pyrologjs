import { Appender } from "./Appender";

export class CallbackAppender implements Appender {
    private readonly _cf: Function;
    constructor(cf: Function) {
        if ( typeof cf !== 'function' ) {
            throw new Error('Invalid callback function specified!');
        }
        this._cf = cf;
    }

    /**
     * @override
     */
    appendLog(...logs: any): void {
        this._cf(logs);
    }
}