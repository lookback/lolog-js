import { PreparedLog, Severity } from "./prepare";

export interface Output {
    debug(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

export const consLogger = (prep: PreparedLog, output: Output) => {
    const { severity, message, merged } = prep;
    const fn = selectFn(output, severity);
    const time = new Date(prep.timestamp);
    if (merged) {
        fn.call(output, time, prep.severity, message, merged);
    } else {
        fn.call(output, time, prep.severity, message);
    }
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
