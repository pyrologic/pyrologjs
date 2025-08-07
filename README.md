# pyrologjs

## Contents

1. [About](#about)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Hierarchical Logger Configuration](#hierarchical-logger-configuration)
5. [Advanced Features](#advanced-features)
6. [API Details](#api-details)


## About

- **pyrologjs** is a small, lightweight yet powerful logging facility for use in JavaScript and/or TypeScript modules.
It can be used for web sites as well as in code for nodejs or similar environments.

- **pyrologjs** itself is written entirely in TypeScript and compiled and bundled using [rollup.js](https://rollupjs.org/guide/en/).
The code provided by this package is neither minimized nor mangled nor compressed. This allows you to bundle the package along
with your code using your preferred way how to minimize, mangle and compress your code distribution.

- **pyrologjs** has no other dependencies.

- **pyrologjs** is licensed under a MIT license. See [LICENSE.txt](LICENSE.txt) for details.


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
    { name: '42', level: 'ALL' }                    // deprecated: plain old way to define a logger configuration item, possible in JavaScript only and not recommended
];
```

The last step of the initialization is to apply the configuration and to create some loggers:
```js
/**
 * logger initialization
 */
function init() {
    console.log('PyroLog init!');
    // apply configuration
    PL.applyConfiguration(config);
    // create some loggers
    const l1 = PL.getLogger('logger1');
    const l2 = PL.getLogger('logger2');
    // use the loggers
    l1.debug("Hello DEBUG logger!", "How are you?");
    l2.info("Hello INFO logger!", config);
    l2.debug("This text should not be logged!");
}
```
You can change the logger configuration at any time.

### TypeScript Example

The whole module is written in TypeScript and can be used in other TypeScript projects, of course. In order to do so, you should explicitly import all relevant types:
```ts
import { PyroLog, Logger, Level } from "@pyrologic/pyrologjs";
```

The usage of TypeScript benefits from the availability of all type definitions.

The example code would be the same as in the JavaScript example above with one exception: It is not possible to use a plain JavaScript object as configuration item (and it's deprecated anyway).


## Hierarchical Logger Configuration

**pyrologjs** supports a hierarchical logger configurations so one can easily apply some settings to a bunch of loggers. See the following
example how to create such a logger configuration:
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

### Global Options

PyroLog supports several global options that apply to all currently available loggers. They cannot be set by a logger configuration. Instead, there's an API:
```ts
const PL = PyroLog.getInstance();
// set global options
PL.setGlobalOptions({ useDebug: true, suspended: false });
```
The following global options are supported:
| Option Name | Type       | Default value | Description                     |
| ----------- | ---------- | ------------- | ------------------------------- |
| useDebug    | boolean    | `false`       | if **true** then logging levels of DEBUG or below will use `console.debug()` to write a log message;<br/> otherwise `console.log()` is used |
| suspended   | boolean    | `false`       | if **true** then **all** loggers will **not** write any log message, regardless of the logging level;<br/> otherwise the common level based rules apply |

You can set the global `suspended` option to `true` to temporarily stop **all** logging output without having to change the logger configuration. Setting it back to `false` will resume normal logging behavior.

See below how to suspend an individual logger.


### Change Logger Configuration

You can apply a new logger configuration at any time by calling `PyroLog.getInstance().applyConfiguration()` with the new logger configuration.
In this case, the previous configuration is dropped, the new configuration is checked and parsed and all existing loggers are re-configured
with the new settings.


### Suspend An Individual Logger

Each logger has a property called `suspended`. If this property is set to `true` for a particular logger using the API method
`Logger.setSuspended(boolean)` then only this logger is suspended, while all other loggers operate normally. See above how to suspend all
logger at once.


### Logging Level Enumeration in JavaScript

The symbolic logging level values are not directly available in JavaScript, since the TypeScript enumeration `Level` is resolved by the TypeScript compiler. In order to deal with that, you can use the object `JsLevel` instead, which provides each logging level as a property:
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
    FATAL: Level.FATAL,
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

In order to deal with other approaches such as using your own utility methods for logging, you can set an offset value that's used to examine the call stack for the calling function / method. This way, you can easily achieve that the real calling function / method appears in the logs.
```ts
// set the offset to 1 if you have an utility method in class that's used for logging
logger.setFncOffset(1);
```

The default behavior is specified at default logger. If a logger configuration does not set the "write function name" parameter at all, then the logger will take its
setting from default logger.
```ts
const config = [
    PL.createConfigItem(PL.defaultName, 'INFO', true), // sets the default logging level to INFO and activates the "write function name"
    PL.createConfigItem('logger1', 'WARN', false),     // "logger1" is set to level WARN and NOT to write the name of the calling function / method
    PL.createConfigItem('logger2', 'DEBUG'),           // "logger2" is set to level DEBUG and takes the default setting for the "write function name" flag
                                                       // it will be set to true in this case here
    //...
];

```

### Appenders

If you want, you can specify a callback function that acts as special "appender". This function is called each time a log message is written to the console.
```js
const PL = PyroLog.getInstance();

/**
 * a callback function used as "appender"
 * @param {*} logs log entries
 */
function myAppender(logs) {
    // every log message goes here
    // you can do whatever you want to do with these log messages :-)
    // you could write them to a DOM element or whatever else
    // this code below causes all logger messages to appear twice in the console
    console.log('APPENDER', ...logs);
}
// ...
PL.createAppender(myAppender, true);

```

You can set a new appender or just remove the current appender as needed at any time calling `PyroLog.getInstance().setAppender()`. Pass `null` as
parameter to remove the current appender.

The appender is used for all loggers.


### Custom Prefix Generator

PyroLog creates a prefix string for each log message it writes to the console.
The code looks like this:
```ts
return ${(new Date()).toISOString()} ${logger.name} [${Level2String(level)}]` + (logger.writeFnc ? ` (${PyroLogUtils.getFunctionName(logger.fncOffset)})` : '') + ':';
```
This will produce prefixes as shown bellow:
```
2022-08-29T15:35:52.073Z logger1 [TRACE] (MyClass#myMethod):
```

You can set our own prefix creator instance and thus create the log prefix you want. All you need is to write a class that implements the interface `PrefixGenerator`.
```ts
import { PyroLog, Logger, Level, PrefixGenerator, Level2String, PyroLogUtils, String2Level } from "@pyrologic/pyrologjs";
// ...
const PL = PyroLog.getInstance();
//...
class MyPrefixGenerator implements PrefixGenerator {
    createPrefix(logger: Logger, level: Level): string {
        return `MyPrefix / ${logger.name} / ${Level2String(level)}:`;
    }
}
//...
// set our prefix generator
PL.setPrefixGenerator(new MyPrefixGenerator());
```
It is possible tu use a callback function as prefix generator:
```ts
const PL = PyroLog.getInstance();
//...
// another way to set a prefix generator using a callback function
PL.createPrefixGenerator((logger, level) => {
    return `Look at this "${logger.name}[${Level2String(level)}]": `;
}, true);
```

The prefix generator is used for all loggers.

If you want to use the "write function name" feature then your prefix generator must check logger's setting and retrieve the name of the calling function.
See above for an example.



## API Details


### The Main PyroLog Class

All use of **pyrologjs** starts using the class `PyroLog`. Its public interface is:
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
     * sets global options
     * @param o an object providing one or more global options
     */
    setGlobalOptions(o: any): void;

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
     * sets a new prefix generator
     * @param generator new prefix generator
     */
    setPrefixGenerator(generator: PrefixGenerator | null): void;

    /**
     * creates a prefix generator
     * @param fn actual prefix generator function
     * @param set flag whether to set this prefix generator immediately as current prefix generator
     * @returns the created prefix generator instance
     */
    createPrefixGenerator(fn: (logger:Logger, level:Level) => string, set: boolean) : PrefixGenerator;

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

This class is a singleton. To get the one and only instance, call `PyroLog.getInstance()`.


### The Logger Interface

Each logger you create provides the following public interface:
```ts
/**
 * the main logger interface
 */
interface Logger {
    /** logger name */
    readonly name: string;
    /** logging level of this instance */
    readonly level: Level;
    /** "write function name" flag */
    readonly writeFnc: boolean;
    /** the offset for the call stack used to get the name of the calling function */
    readonly fncOffset: number;
    /** the current "suspended" state of this logger */
    readonly suspended: boolean;

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
     * writes a log message at level WARN
     * @param data data to be logged
     */
    warn(...data: any[]): void;

    /**
     * writes a log message at level ERROR
     * @param data data to be logged
     */
    error(...data: any[]): void;

    /**
     * writes a log message at level FATAL
     * @param data data to be logged
     */
    fatal(...data: any[]): void;

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

    /**
     * sets the "suspended" state for this logger
     * @param suspended the "suspended" state for this logger
     */
    setSuspended(suspended: boolean): void;
}
```


### The Logging Level Enumeration

All logging levels are elements of the `Level` enumeration:
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
    /** FATAL level */
    FATAL,
    /** loggers at this level do not log at all */
    OFF
}
```


### The ConfigItem Interface

Each logger gets its configuration by an instance of `ConfigItem`:
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
    readonly writeFnc: Boolean | null;
}
```

Note, that `LevelStrings` is the string representation of the `Level` enumeration:
```ts
LevelStrings = "ALL" | "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "OFF"
```

The best way to create configuration items is by using `PyroLog.getInstance().createConfigItem()`.


<sub>_End Of Document_</sub>
