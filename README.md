# pyrologjs

## About

**pyrologjs** is small, lightweight yet powerful logging facility for use in JavaScript and/or TypeScript modules.
It can be used on web sites as in code for nodejs or similar environments.

**pyrologjs** itself is written entirely in TypeScript and compiled and bundled using [rollup.js](https://rollupjs.org/guide/en/).

**pyrologjs** has no other dependencies.


## Installation

Use your preferred package manager and install **pyrologjs** as dependency of your project.

npm example:
```
npm install @pyrologic/pyrologjs
``` 

yarn example:
```
yarn add @pyrologic/pyrologjs
```


## Usage

### JavaScript Example

Just import the main class `PyroLog` as shown below:
```js
import { PyroLog } from "@pyrologic/pyrologjs";
```
Then, get the `PyroLog` singleton instance:
```js
/**
 * PyroLog singleton instance
 */
const PL = PyroLog.getInstance();
```
Create the desired logger configurations. Example:
```js
/**
 * a simple configuration
 */
const config = [
    PL.createConfigItem(PL.defaultName, 'WARN'),    // sets the default logging level to WARN
    PL.createConfigItem('logger1', 'DEBUG'),        // "logger1" is set to level DEBUG
    PL.createConfigItem('logger2', 'INFO'),         // "logger2" is set to level INFO
    PL.createConfigItem('logger3', 'ERROR'),        // "logger3" is set to level ERROR
    { name: '42', level: 'ALL' }                    // plain old way to define a logger configuration item, possible in JavaScript but not recommended
];
```

The last initialization step is to apply the configuration and to create some loggers:
```js
/**
 * logger initialization
 */
function init() {
    console.log('PyroLog init!');
    PL.applyConfiguration(config);
    const l1 = PL.getLogger('logger1');
    const l2 = PL.getLogger('logger2');
    l1.debug("Hello DEBUG logger!", "How are you?");
    l2.info("Hello INFO logger!", config);
    l2.debug("This text should not be logged!");
}
```
You can change the logger configuration at any time. And you can set a new appender or just remove the current appender as needed.

### TypeScript Example

The whole module is written in TypeScript and can be used in other TypeScript projects, of course. One should explicitly import all relevant types:
```ts
import { PyroLog, Logger, Level } from "@pyrologic/pyrologjs";
```

The usage of TypeScript benefits from the availability of all type definitions.

The example code would be the same as above with one exception: It is not possible to use a plain JavaScript object as configuration item.


## Hierarchical Logger Configuration

**pyrologjs** supports a hierarchical logger configuration so one can easily apply some settings to a bunch of loggers. See the following
example shows how to create such a logger configuration:
```ts
/**
 * hierarchical logger configuration
 */
 const config = [
    PL.createConfigItem(PL.defaultName, 'WARN'),                        // sets the default logging level to WARN
    PL.createConfigItem('main.sub1', 'WARN'),                           // set "main.sub1" to level WARN
    PL.createConfigItem('main.sub2', 'INFO'),                           // set "main.sub2" to level INFO
    PL.createConfigItem('main', 'ERROR'),                               // set "main" to level ERROR
    PL.createConfigItem('main.sub1.detail', 'DEBUG'),                   // set "main.sub1.detail" to DEBUG
    PL.createConfigItem('main.sub2.mute', 'OFF'),                       // set "main.sub2.mute" to OFF
    // PL.createConfigItem('an.invalid.name', 'ERROR'),                 // ERROR: logger names must not begin with a period
    // PL.createConfigItem('also.an.invalid.name.', 'ERROR'),           // ERROR: logger names must not end with a period
    PL.createConfigItem('this.is . an . acceptable . name', 'DEBUG'),   // white spaces are trimmed
];
```

If subsequently a logger is created then it gets the best matching configuration. In the example above the following configurations would apply:
1. logger `main.sub1.MyClass1` -> level WARN from `main.sub1`
2. logger `main.sub2.mute.OldCode` -> level OFF from `main.sub2.mute`
3. logger `main.anything.not.configured` -> level ERROR from `main`
4. logger `anything.else` -> level WARN from default configuration

If you have experience with some Java logging libraries such as [Log4j](https://logging.apache.org/log4j/2.x/) then you should be familiar with that principle.


## Advanced Features

### Change Logger Configuration

You can apply a new logger configuration at any time calling `PyroLog.getInstance().applyConfiguration()` with the new logger configuration.
In this case, the previous configuration is dropped, the new configuration is checked and parsed and then all existing loggers are re-configured
withe the new settings.

### Logging Level Enumeration in JavaScript

The symbolic logging level values are not directly available in JavaScript, since the TypeScript enumeration `Level` is resolved by the TypeScript compiler. In order to deal with that, one can use the object `JsLevel` instead, which provides each logging level as a property:
```js
import { JsLevel } from "@pyrologic/pyrologjs";
```

The object `JsLevel` itself is defined like this:
```js
const JsLevel = {
    ALL: Level.ALL,
    TRACE: Level.TRACE,
    DEBUG: Level.DEBUG,
    INFO: Level.INFO,
    WARN: Level.WARN,
    ERROR: Level.ERROR,
    OFF: Level.OFF
};
```

### Stack Traces

For some diagnostic message it is helpful to get a full stack trace. **pyrologjs** provides an easy way to do so:
```js
const PL = PyroLog.getInstance();
const logger = PL.getLogger('logger');
// method one
logger.debug('Stack trace:\n' + PL.stackTrace);
// method two
PL.writeStackTrace(logger, 'INFO', 'Call stack:');
```

### Name of Calling Function / Method

You can set loggers to write the name of the calling function / method along with each logging message. This is achieved by a flag of a configuration item:
```ts
const config = [
    PL.createConfigItem(PL.defaultName, 'WARN'),        // sets the default logging level to WARN
    PL.createConfigItem('logger1', 'DEBUG', true),      // "logger1" is set to level DEBUG and to write the name of the calling function / method
    //...
];
```
This will work properly only if you use the common logging methods, such as `Logger.debug()`, `Logger.warn()` etc.

In order to deal with another approaches such as some own utility methods for logging, you can set an offset value that's used to examine the call stack for the calling function / method. This way, you can easily achieve that the real calling function / method appears in the logs.
```ts
// set the offset to 1 if you have an utility method in class that's used for logging
logger.setFncOffset(1);
```


### Appenders

If you want, you can specify a callback function that acts as special "appender". This function is called each time a log message was written to the console.
```js
const PL = PyroLog.getInstance();

/**
 * a callback function used as "appender"
 * @param {*} logs log entries
 */
function myAppender(logs) {
    // every log message goes here
    // you can do whatever you want to do with these log messages :-)
    console.log('APPENDER', ...logs);
}

// ...

PL.createAppender(myAppender, true);

```

## API Details


### The Main PyroLog Class

All use of **pyrologjs** start using the class `PyroLog`. Its public interface is:
```ts
class PyroLog {
    /**
     * returns the singleton instance
     * @returns the singleton instance
     */
    static getInstance(): PyroLog;

    /**
     * the name of the default configuration item
     */
    get defaultName(): string;

    /**
     * the default level for new loggers
     */
    get defaultLevel(): Level;

    /**
     * the stack trace as string
     */
    get stackTrace(): string;

    /**
     * the name of the calling function as string
     */
    get functionName(): string;

    /**
     * returns a logger
     * @param name logger name
     * @returns {Logger} the logger
     */
    getLogger(name: string): Logger;

    /**
     * creates a new callback appender
     * @param cf callback function
     * @param set flag whether to set this appender immediately
     * @returns the created appender
     */
    createAppender(cf: Function, set: boolean): Appender;

    /**
     * sets a new appender
     * @param appender the new appender, may be null
     */
    setAppender(appender: Appender | null): void;

    /**
     * creates a configuration item
     * @param name logger name
     * @param level logging level
     * @param wf flag whether to write the name of the calling function / method
     * @returns the created configuration item
     */
    createConfigItem(name: string, level: LevelStrings, wf?: boolean): ConfigItem;

    /**
     * applies a logger configuration
     * @param config array of configuration items
     */
    applyConfiguration(config: ConfigItem[]): void;

    /**
     * writes the current stack trace to the specified logger
     * @param logger target logger
     * @param level logging level
     * @param message optional message text
     */
    writeStackTrace(logger: Logger, level: LevelStrings, message?: string): void;
}
```


### The Logger Interface

Each logger that you create provides the following public interface:
```ts
/**
 * the main logger interface
 */
interface Logger {
    /** logger name */
    readonly name: string;
    /** logging level of this instance */
    readonly level: Level;

    /**
     * checks whether this logger is enabled for a specific logging level
     * @param l logging level
     * @returns true if this logger is enabled for the specified logging level; false otherwise
     */
    isEnabledFor(l: Level): boolean;

    /**
     * @returns true if this logger is enabled for logging at level DEBUG or above; false otherwise
     */
    isDebugEnabled(): boolean;

    /**
     * @returns true if this logger is enabled for logging at level TRACE or above; false otherwise
     */
    isTraceEnabled(): boolean;

    /**
     * writes a log message at the specified level
     * @param l logging level
     * @param data data to be logged
     */
    writeLog(l: Level, ...data: any[]): void;

    /**
     * writes a log message at level TRACE
     * @param data data to be logged
     */
    trace(...data: any[]): void;

    /**
     * writes a log message at level DEBUG
     * @param data data to be logged
     */
    debug(...data: any[]): void;

    /**
     * writes a log message at level INFO
     * @param data data to be logged
     */
    info(...data: any[]): void;

    /**
     * writes a log message at level INFO
     * @param data data to be logged
     */
    warn(...data: any[]): void;

    /**
     * writes a log message at level INFO
     * @param data data to be logged
     */
    error(...data: any[]): void;

    /**
     * logs the current stack trace
     * @param l logging level
     * @param skip number of stack entries to skip
     * @param message optional message text
     */
    writeStackTrace(l: Level, skip: number, message?: string): void;

    /**
     * sets an offset for the call stack used to get the name of the calling function
     * @param offs the offset use to get the name of the calling function
     */
    setFncOffset(offs: number): void;
}
```


### The Logging Level Enumeration

All logging levels are items of the `Level`enumeration:
```ts
/**
 * logging levels
 */
enum Level {
    /** logs everything  */
    ALL,
    /** TRACE level */
    TRACE,
    /** DEBUG level */
    DEBUG,
    /** INFO level */
    INFO,
    /** WARN level */
    WARN,
    /** ERROR level */
    ERROR,
    /** loggers at this level do not log at all */
    OFF
}
```


### The ConfigItem Interface

Each logger gets its configuration by an instance if `ConfigItem`:
```ts
/**
 * configuration item
 */
interface ConfigItem {
    /** logger name */
    readonly name: string;
    /** logging level */
    readonly level: LevelStrings;
    /** flag whether to write the name of the calling function / method along with each output */
    readonly writeFnc: boolean;
}
```

Note, that `LevelStrings` is the string representation of the `Level` enumeration:
```ts
LevelStrings = "ALL" | "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "OFF"
```


## ToDos
1. more comprehensive documentation
2. ...

more to come
