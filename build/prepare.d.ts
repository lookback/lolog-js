/**
 * Enumeration of severities.
 */
export declare enum Severity {
    Trace = "TRACE",
    Debug = "DEBUG",
    Info = "INFO",
    Warn = "WARN",
    Error = "ERROR"
}
/**
 * Internal type for a prepared log message.
 */
export interface PreparedLog {
    severity: Severity;
    appName: string;
    timestamp: number;
    message: string;
    merged?: {
        [key: string]: any;
    };
}
/**
 * Helper to prepare a log message, rejecting it if it's not well formed.
 */
export declare const prepareLog: (severity: Severity, defaultAppName: string, args: any[]) => PreparedLog | undefined;
export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
}
/** Serialize and Error to a plain object, keeping commonly used properties. */
export declare const serializeError: (err: Error) => SerializedError;
/** Recursive helper to remove complex objects. */
export declare const filterUnwanted: (oin: any) => any;
