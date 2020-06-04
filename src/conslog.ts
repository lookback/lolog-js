import { LoggerImpl } from './syslog';
import { PreparedLog, Severity } from './prepare';
import isBrowser from 'is-browser';

export interface Output {
    debug(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

export const createConsLogger = (output: Output): LoggerImpl => async (prep: PreparedLog) => {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    if (merged) {
        if (isBrowser) {
            fn.call(output, prep.severity, message, merged);
        } else {
            const util = require('util');
            const mergedFormat =  util.inspect(merged, {
                compact: false,
                colors: true,
                breakLength: 16,
                depth: 1000,
            });
            fn.call(output, prep.severity, message, mergedFormat);
        }
    } else {
        fn.call(output, prep.severity, message);
    }
    return {
        attempts: 1,
    };
};

const selectFn = (output: Output, severity: Severity) => {
    switch (severity) {
        case Severity.Trace:
            return output.debug;
        case Severity.Debug:
            return output.debug;
        case Severity.Info:
            return output.log;
        case Severity.Warn:
            return output.warn;
        case Severity.Error:
            return output.error;
    }
};
