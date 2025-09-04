import { Level, LevelStrings, Level2String, String2LevelString, String2Level, Level2LevelString } from "./Level";
import { ConfigItem } from "./ConfigItem";
import { Logger } from "./Logger";
import { LoggerFactory } from "./LoggerFactory";
import { Appender } from "./Appender";
import { PrefixGenerator } from "./PrefixGenerator";
import { Utils } from "./utils";
import { GlobalOptions } from "./GlobalOptions";
import { PyroLogger } from "./PyroLogger";
import { BOLD_TEXT, ColorRef, Colors, EMPTY_STYLE, LevelStyles, SIMPLE_TEXT, StyleDef, TextStyle } from "./Styles";

class PyroLog {

    private _lf: LoggerFactory;

    private constructor() {
        this._lf = LoggerFactory.getInstance();
        Object.freeze(this);
    }

    static _create(): PyroLog {
        return new PyroLog();
    }

    /**
     * returns the singleton instance
     * @returns the singleton instance
     */
    static getInstance(): PyroLog {
        return pyroLog;
    }

    /**
     * the logger factory instance
     */
    get Factory(): LoggerFactory {
        return this._lf;
    }

    /**
     * the name of the default configuration item
     */
    get defaultName(): string {
        return this._lf.defaultName;
    }

    /**
     * the default level for new loggers
     */
    get defaultLevel() : Level {
        return this._lf.defaultLevel;
    }

    /**
     * the stack trace as string
     */
    get stackTrace(): string {
        return Utils.getStack(2);
    }

    /**
     * the name of the calling function as string
     */
    get functionName(): string {
        return Utils.getFunctionName(1, '#');
    }

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string): Logger {
        return this._lf.getLogger(name);
    }

    /**
     * sets global options
     * @param o an object providing one or more global options
     */
    setGlobalOptions(o: any): void {
        GlobalOptions.getInstance().setOptions(o);
    }

    /**
     * creates a level style descriptor
     * @param param0 
     * @returns the level style descriptor
     */
    createLevelStyle({
        color = Colors.NONE,
        background = Colors.NONE,
        bold = false,
        italic = false,
        underline = false,
        linethrough = false
    }): StyleDef {
        return this._lf.createLevelStyle({ color, background, bold, italic, underline, linethrough });
    }

    /**
     * creates a new callback appender
     * @param cf callback function
     * @param set flag whether to set this appender immediately
     * @returns the created appender
     */
    createAppender(cf: Function, set: boolean): Appender {
        return this._lf.createAppender(cf, set);
    }

    /**
     * sets a new appender
     * @param appender the new appender, may be null
     */
    setAppender(appender: Appender | null): void {
        this._lf.setAppender(appender);
    }

    /**
     * sets a new prefix generator
     * @param generator new prefix generator
     */
    setPrefixGenerator(generator: PrefixGenerator | null): void {
        this._lf.setPrefixGenerator(generator);
    }

    /**
     * creates a prefix generator
     * @param fn actual prefix generator function
     * @param set flag whether to set this prefix generator immediately as current prefix generator
     * @returns the created prefix generator instance
     */
    createPrefixGenerator(fn: (logger:Logger, level:Level) => string, set: boolean) : PrefixGenerator {
        return this._lf.createPrefixGenerator(fn, set);
    }

    /**
     * creates a logger configuration item
     * @param name logger name
     * @param level logging level
     * @param wf flag whether to write the name of the calling function / method
     * @returns the created configuration item
     */
    createConfigItem(name: string, level: LevelStrings, wf: Boolean | null = null) : ConfigItem {
        return this._lf.createConfigItem(name, level, wf);
    }

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void {
        this._lf.applyConfiguration(config);
    }

    /**
     * sets the global style definition for a logging level
     * @param level the logging level
     * @param style the global style definition
     */
    setLevelStyle(level: Level, style: StyleDef) {
        GlobalOptions.getInstance().setLevelStyle(level, style);
    }

    /**
     * writes the current stack trace to the specified logger
     * @param logger target logger
     * @param level logging level
     * @param message optional message text
     */
    writeStackTrace(logger: Logger, level: LevelStrings, message?: string) {
        logger.writeStackTrace(Level[level], 3, message);
    }
}

// create the singleton instance
const pyroLog = PyroLog._create();

// create Level enumeration as JS object
const JsLevel = Object.freeze({
    ALL: Level.ALL,
    TRACE: Level.TRACE,
    DEBUG: Level.DEBUG,
    INFO: Level.INFO,
    WARN: Level.WARN,
    ERROR: Level.ERROR,
    FATAL: Level.FATAL,
    OFF: Level.OFF
});

// export everything that should be exported
export { 
    Appender, 
    BOLD_TEXT,
    ColorRef,
    Colors,
    ConfigItem, 
    EMPTY_STYLE,
    Logger, 
    PyroLog, 
    Level, 
    PrefixGenerator, 
    LevelStrings, 
    LevelStyles,
    Level2String, 
    Level2LevelString,
    JsLevel, 
    PyroLogger,
    String2LevelString, 
    String2Level, 
    SIMPLE_TEXT,
    StyleDef,
    TextStyle,
    Utils as PyroLogUtils
};
