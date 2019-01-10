/**
 * The overloaded variants of logging.
 */
declare type LogFunction = {
    /** Log just one message. */
    (message: string): void;
    /** Log a message and some well known, indexed fields. */
    (message: string, wellKnown: WellKnown): void;
    /** Log a message; some well known, indexed fields and some random json serializable data. */
    (message: string, wellKnown: WellKnown, data: Data): void;
};
/**
 * Unindexed, JSON serializable data.
 */
export declare type Data = {
    [key: string]: any;
};
/**
 * Fields we together have decided the name of and are indexed for searching.
 */
export interface WellKnown {
    recordingId?: string;
    userId?: string;
}
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
export declare const isWellKnown: (t: any, reject?: ((msg: string) => void) | undefined) => t is WellKnown;
/**
 * Logging instance.
 */
export interface Logger {
    /**
     * Trace is the lowest level possible. It is things like direct raw dump on HTTP protocol
     * level etc. It's not possible to forward this level to the ingester.
     * It is only for local development.
     */
    trace: LogFunction;
    /**
     * Debug is a low level that, when needed for debugging reasons and limited time periods,
     * can be forwarded to the log ingester. It is allowed to be more verbose and detailed.
     * The audience is mainly the developer of the service
     */
    debug: LogFunction;
    /**
     * Info is the default run level that is forwarded to our log ingester. It is a message
     * that mostly make sense for the developer of the service. It is fine to use this for
     * higher level room events in dormammu, or stripe callback events.
     */
    info: LogFunction;
    /**
     * Warn is a problem that the application can recover from itself, but needs to be
     * seen by someone during office hours. The message must be such that anyone, not just
     * the developer can understand the problem.
     */
    warn: LogFunction;
    /**
     * Error is a serious problem that must be dealt with right away. Wake up whoever is on
     * duty in the middle of the night kind of seriousness. The message must be such that
     * anyone, not just the developer can understand the problem.
     */
    error: LogFunction;
}
/**
 * The level of compliance with our defined log levels.
 *
- `local1` is
- `local2`  */
export declare enum Compliance {
    /**
     * For services that fully adhere to our levels. An `ERROR` level event means waking
     * up who is on call in the middle of the night. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local0`
     */
    Full = 0,
    /**
     * For services that are somewhat compliant with the log levels. An `ERROR` level event
     * is not going to wake anyone up. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local1`
     */
    Mid = 1,
    /**
     * For services that have just been converted. Nothing is forwarded to our log web UI.
     * They are available via SSH on the log ingester.
     *
     * Use syslog facility `local2`
     */
    None = 2
}
/**
 * Options for initializing the logging.
 */
export interface Options {
    /**
     * The syslog host.
     */
    host: string;
    /**
     * The port to send to.
     */
    port: number;
    /**
     * Application name.
     */
    appName: string;
    /**
     * How compliant the app is with our log definition.
     */
    compliance: Compliance;
    /**
     * Do not log to console.log()
     */
    disableConsole: boolean;
}
/**
 * Create a logger from the options.
 */
export declare const createLogger: (opts: Options) => Logger;
export {};
