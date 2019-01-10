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
    appName: string;
    timestamp: number;
    message: string;
    merged?: { [key: string]: any };
}


/**
 * Helper to prepare a log message, rejecting it if it's not well formed.
 */
export const prepareLog = (
    severity: Severity,
    appName: string,
    args: any[]
): PreparedLog | undefined => {
    if (args.length == 0) {
        console.log('Ignoring empty log row');
        return;
    }
    const message = String(args[0]);
    const wellRaw = args.length >= 2 ? args[1] : {};
    const data = args.length == 3 ? args[2] : {};

    // ensure well know really only contains well known fields
    if (!isWellKnown(wellRaw, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }

    // our own local copy, so we can delete without affecting the input
    const well = { ...wellRaw };

    const timestamp = well.timestamp || Date.now();
    // tslint:disable-next-line:no-object-mutation
    delete well.timestamp;

    const dataLen = Object.keys(data).length;
    const mergeLen = Object.keys(well).length + dataLen;
    const merged = mergeLen > 0 ? { ...well, ...(dataLen ? { data } : {}) } : undefined;

    return {
        severity,
        timestamp,
        appName,
        message,
        merged,
    };
};

