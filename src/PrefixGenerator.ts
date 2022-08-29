import { Level } from "./Level";
import { Logger } from "./Logger";

export interface PrefixGenerator {

    /**
     * creates a prefix text for a log message
     * @param logger the logger
     * @param level the logging level of the message to be logged
     * @returns the created prefix text
     */
    createPrefix(logger: Logger, level: Level): string;
}