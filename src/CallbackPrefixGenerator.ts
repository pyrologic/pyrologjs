import { Level } from "./Level";
import { Logger } from "./Logger";
import { PrefixGenerator } from "./PrefixGenerator";

/**
 * a callback prefix generator that wraps a callback function
 */
export class CallbackPrefixGenerator implements PrefixGenerator {
    private readonly _pgf: (logger:Logger, level:Level) => string;
    constructor(fn: (logger:Logger, level:Level) => string) {
        this._pgf = fn;
    }
    /**
     * @override
     */
    createPrefix(logger: Logger, level: Level): string {
        return this._pgf(logger, level);
    }
}