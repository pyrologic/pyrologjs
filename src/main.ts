import { LoggerFactory } from "./LoggerFactory";

console.log('Hello PyroLog!');

const lf = LoggerFactory.getInstance();
lf.getLogger("abc");


export class PyroLog {

    private lf: LoggerFactory;

    constructor() {
        this.lf = LoggerFactory.getInstance();
    }

    static getInstance(): PyroLog {
        return pyroLog;
    }

    get Factory(): LoggerFactory {
        return this.lf;
    }
}

const pyroLog = new PyroLog();
