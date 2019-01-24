import { LoggerImpl } from './syslog';
import { Options } from '.';
import { PreparedLog } from './prepare';

const declareLoggly = require('./loggly-2019-01-10.js');

export interface LogglyTracker {
    push: {
        (message: string): void;
        (data: { [key: string]: any }): void;
    };
}

/**
 * Helper to create a loggly tracker, and hide it behind some typing.
 */
const createLogglyTracker = (logglyKey: string): LogglyTracker => {
    // only do this once, it injects LogglyTracker on window.
    if (!(window as any).LogglyTracker) {
        declareLoggly();
    }

    // instantiate a tracker
    const logger: LogglyTracker = new (window as any).LogglyTracker();

    // init by pushing a first message (strange)
    (logger as any).push({
        logglyKey,
        // sendConsoleErrors patches console.err, we don't want that
        sendConsoleErrors: false,
        // why not "utf"?
        useUtfEncoding: true,
    });

    return logger;
};


/**
 * Create a loggly loggler from options.
 */
export const createLogglyLogger = (opts: Options): LoggerImpl => {
    // the apiKey is the loggly api key.
    const loggly = createLogglyTracker(opts.apiKey);

    return (prep: PreparedLog) => {
        // seems we can't communicate severity to loggly through this api.
        const m = `${prep.message}`;
        const json = {
            env: opts.env,
            appName: prep.appName,
            severity: prep.severity,
            text: m,
            ...(prep.merged || {}),
        };
        loggly.push(json);
    };
};
