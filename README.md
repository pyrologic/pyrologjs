# pyrologjs

## About

**pyrologjs** is small, lightweight yet powerful logging facility for use in JavaScript and/or TypeScript modules.
It can be used on web sites as in code for nodejs or similar environments.

**pyrologjs** itself is written entirely in TypeScript and compiled and bundled using [rollup.js](https://rollupjs.org/guide/en/).


## Installation

Use your preferred package manager and install **pyorologjs** as dependency of your project.

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
```
import { PyroLog } from "@pyrologic/pyrologjs";
```
Then, get the `PyroLog` singleton instance:
```
/**
 * PyroLog singleton instance
 */
const PL = PyroLog.getInstance();
```
Create the desired logger configurations. Example:
```
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
```
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
You can change the logger configuraton at any time. And you can set a new appender or just remove the current appender as needed.

### TypeScript Example

The whole module is written in TypeScript and be used in other TypeScript projects, of course. One should eplicitly import all relevant types:
```
import { PyroLog, Logger, Level } from "@pyrologic/pyrologjs";
```

The usage of TypeScript benefits from the availablity of all type definitions.

The example code would be the same as above with one exception: It is not possible to use a plain JavaScrip object as configuration item.


## Advanced Features

### Logging Level Enumeration in JavaScript

The symbolic logging level values are not directly available in JavaScript, since the TypeScript enumeration `Level` is resolved by the TypeScript compiler. In order to deal with that, one can use the object `JsLevel` instad, which provides each logging level as a property:
```
import { JsLevel } from "@pyrologic/pyrologjs";
```

The object `JsLevel` itself is defined like this:
```
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
```
const PL = PyroLog.getInstance();
const logger = PL.getLogger('logger');
// method one
logger.debug('Stack trace:\n' + PL.stackTrace);
// method two
PL.writeStackTrace(logger, 'INFO', 'Call stack:');

```

### Appenders

If you want, you can specify a callback function that acts as special "appender". This function is called each time a log message was written to the console.
```
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
t.b.c.
