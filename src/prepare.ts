import { isWellKnown } from ".";

/**
 * Enumeration of severities.
 */
export enum Severity {
    Trace = "TRACE",
    Debug = "DEBUG",
    Info = "INFO",
    Warn = "WARN",
    Error = "ERROR",
}


/**
 * Internal type for a prepared log message.
 */
export interface PreparedLog {
    severity: Severity;
    message: string;
    merged: { [key: string]: any };
}


/**
 * Helper to prepare a log message, rejecting it if it's not well formed.
 */
export const prepareLog = (severity: Severity, args: any[]): PreparedLog | undefined => {
    if (args.length == 0) {
        return;
    }
    const message = String(args[0]);
    const well = args.length >= 2 ? args[1] : {};
    const data = args.length == 3 ? args[2] : {};

    const merged = { ...well, data };

    if (!isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }

    return {
        severity,
        message,
        merged,
    };
};

