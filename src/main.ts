import { LoggerFactory } from "./LoggerFactory";

export class PyroLog {

    private _lf: LoggerFactory;

    constructor() {
        this._lf = LoggerFactory.getInstance();
    }

    static getInstance(): PyroLog {
        return pyroLog;
    }

    get Factory(): LoggerFactory {
        return this._lf;
    }
}

const pyroLog = new PyroLog();
