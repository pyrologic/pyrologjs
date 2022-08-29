import { Level, Level2String } from "./Level";
import { Logger } from "./Logger";
import { PrefixGenerator } from "./PrefixGenerator";
import { PyroLogger } from "./PyroLogger";
import { Utils } from "./utils";

export class PyroPrefixGenerator implements PrefixGenerator {

    /**
     * constructs a new instance
     */
    constructor() {
        // empty so far
    }

    /**
     * @returns the singleton instance
     */
     static getInstance(): PrefixGenerator {
        return pyroPrefixGenerator;
    }

    /**
     * @override
     */
    createPrefix(logger: Logger, level: Level): string {
        const pl: PyroLogger = logger as PyroLogger;
        return `${(new Date()).toISOString()} ${pl.name} [${Level2String(level)}]` + (pl.writeFnc ? ` (${Utils.getFunctionName(pl.fncOffset + 3)})` : '') + ':';
    }
}

const pyroPrefixGenerator = new PyroPrefixGenerator();
