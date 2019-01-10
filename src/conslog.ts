import { PreparedLog, Severity } from "./prepare";

export const consLogger = (prep: PreparedLog) => {
    const { severity, message, merged } = prep;
    switch (severity) {
        case Severity.Trace:
            console.debug(Severity.Trace, message, merged);
            break;
        case Severity.Debug:
            console.debug(Severity.Debug, message, merged);
            break;
        case Severity.Info:
            console.log(Severity.Info, message, merged);
            break;
        case Severity.Warn:
            console.warn(Severity.Warn, message, merged);
            break;
        case Severity.Error:
            console.error(Severity.Error, message, merged);
            break;
    }
};
