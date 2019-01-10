import { Options } from ".";
import { LoggerImpl } from "./syslog";
import { PreparedLog } from "./prepare";

export interface LogglyTracker {
    push: {
        (message: string): void;
        (message: string, json: { [key: string]: any }): void;
    };
}

/**
 * Helper to create a loggly tracker, and hide it behind some typing.
 */
const createLogglyTracker = (logglyKey: string): LogglyTracker => {
    // only require this if we really are in a browser context, since
    // it needs window/document globals to be defined
    require('./loggly-2019-01-10.js')(window, document);

    // instantiate a tracker
    const logger: LogglyTracker = new (window as any).LogglyTracker();

    // init by pushing a first message (strange)
    // sendConsoleErrors patches console.err, we don't want that
    (logger as any).push({ logglyKey, sendConsoleErrors: false });

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
        const m = `${prep.severity} ${prep.message}`;
        if (prep.merged) {
            loggly.push(m, prep.merged);
        } else {
            loggly.push(m);
        }
    };
};
