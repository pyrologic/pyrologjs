import { Level, Level2String } from "./Level";
import { Logger } from "./Logger";
import { PrefixGenerator } from "./PrefixGenerator";
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
        return `${(new Date()).toISOString()} ${logger.name} [${Level2String(level)}]` + (logger.writeFnc ? ` (${Utils.getFunctionName(logger.fncOffset)})` : '') + ':';
    }
}

const pyroPrefixGenerator = new PyroPrefixGenerator();
