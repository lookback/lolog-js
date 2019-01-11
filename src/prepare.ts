// tslint:disable no-object-mutation

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
    const dataRaw = args.length == 3 ? args[2] : {};

    // our own local copies, so we can delete without affecting the input
    const well = filterUndefined(wellRaw);
    const data = filterUndefined(dataRaw);

    // ensure well know really only contains well known fields
    if (!isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }

    const timestamp = well.timestamp || Date.now();
    delete well.timestamp;

    const dataLen = Object.keys(data).length;
    const mergaroo: { [key: string]: any } = { ...well, ...(dataLen ? { data } : {}) };

    const merged = Object.keys(mergaroo).length ? mergaroo : undefined;

    return {
        severity,
        timestamp,
        appName,
        message,
        merged,
    };
};

// delete any undefined/null etc values
const filterUndefined = (oin: any): any => {
    const o = { ...oin };
    for (const k of Object.keys(o)) {
        const v = o[k];
        if (v == null) { // deliberate ==
            delete o[k];
        }
    }
    return o;
};
