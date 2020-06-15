import { isPlainObject } from './is-plain-object';
import { isWellKnown } from './is-well-known';

/**
 * Enumeration of severities.
 */
export enum Severity {
    Trace = 'TRACE',
    Debug = 'DEBUG',
    Info = 'INFO',
    Warn = 'WARN',
    Error = 'ERROR',
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
    disableConsole: boolean;
}

/**
 * Helper to prepare a log message, rejecting it if it's not well formed.
 */
export const prepareLog = (
    severity: Severity,
    defaultAppName: string,
    args: any[],
): PreparedLog | undefined => {
    if (args.length == 0) {
        console.log('Ignoring empty log row');
        return;
    }
    const message = String(args[0]);
    const wellRaw = args.length >= 2 ? args[1] : {};
    const dataRaw = args.length == 3 ? args[2] : {};

    // our own local copies, so we can delete without affecting the input
    const well = filterUnwanted(wellRaw);
    const data = filterUnwanted(dataRaw);

    // ensure wellknown really only contains well known fields
    if (!isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }

    const timestamp = (<any>well).timestamp || Date.now();
    delete (<any>well).timestamp;

    const appName = (<any>well).appName || defaultAppName;
    delete (<any>well).appName;

    const disableConsole = !!(<any>well).disableConsole;
    delete (<any>well).disableConsole;

    const dataLen = Object.keys(data).length;
    const mergaroo: { [key: string]: any } = { ...well, ...(dataLen ? { data } : {}) };

    const merged = Object.keys(mergaroo).length ? mergaroo : undefined;

    return {
        severity,
        timestamp,
        appName,
        message,
        merged,
        disableConsole,
    };
};

export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
}

const isPrimitive = (val: any) => ['number', 'string', 'boolean'].includes(typeof val);

/** Serialize and Error to a plain object, keeping commonly used properties. */
export const serializeError = (err: Error): SerializedError =>
    Object.assign.apply(
        null,
        ['name', 'message', 'stack']
            // Filter out unwanted
            .filter((k) => isPrimitive((err as any)[k]))
            // Create new object array and spread the array on the return object
            .map((k: keyof Error) => ({ [k]: err[k] })),
    );

/** Recursive helper to remove complex objects. */
// TODO fix for cyclic deps?
export const filterUnwanted = (oin: any): any => {
    if (!isOk(oin)) return undefined;

    if (oin instanceof Error) {
        return serializeError(oin);
    }

    if (Array.isArray(oin)) {
        return oin.map((a) => filterUnwanted(a)).filter((a) => a !== undefined);
    } else if (typeof oin === 'object') {
        const filtered = Object.entries(oin)
            .map(([k, v]) => [k, filterUnwanted(v)])
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => ({ [k]: v }));
        return Object.assign({}, ...filtered);
    }
    return oin;
};

/** Check if a single value is something we want. */
const isOk = (v: any) => {
    if (v == undefined) return false; // deliberately non-strict equality
    if (typeof v === 'object') {
        // null, array, plain or complex object
        if (Array.isArray(v) || isPlainObject(v) || v instanceof Error) return true;
        return false;
    }
    // string, boolean, number.
    return true;
};
