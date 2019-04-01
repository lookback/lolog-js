export { serializeError } from './prepare';
/**
 * The overloaded variants of logging.
 */
export declare type LogFunction = {
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
    /**
     * Set log message timestamp with this. Millis since 1970.
     * This is _NOT_ a WellKnown field for lolog server. It's simply here
     * for convenience in the lolog-js API.
     */
    timestamp?: number;
    /**
     * Recording id.
     */
    recordingId?: string;
    /**
     * User id.
     */
    userId?: string;
    /**
     * Ip address of user in question. Be very restrictive with logging this.
     */
    userIp?: string;
}
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
export declare const isWellKnown: (t: any, reject?: (msg: string) => void) => t is WellKnown;
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
    /**
     * Create a sublogger that will be namespaced under this logger. Limited to `/[a-z0-9-]+/`.
     */
    sublogger: (subname: string) => Logger;
    /**
     * Enable sending debug level logs to the log host for this logger. The default
     * is to only send INFO level and above. DEBUG can be enabled while finding an error.
     * TRACE is only ever logged to console.
     *
     * Notice that this only toggles the current logger, not any subloggers.
     */
    setDebug: (debug: boolean) => void;
}
/**
 * The level of compliance with our defined log levels.
 */
export declare enum Compliance {
    /**
     * For services that fully adhere to our levels. An `ERROR` level event means waking
     * up who is on call in the middle of the night. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local0`
     */
    Full = "full",
    /**
     * For services that are somewhat compliant with the log levels. An `ERROR` level event
     * is not going to wake anyone up. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local1`
     */
    Mid = "mid",
    /**
     * For services that have just been converted. Nothing is forwarded to our log web UI.
     * They are available via SSH on the log ingester.
     *
     * Use syslog facility `local2`
     */
    None = "none"
}
/**
 * Options for initializing the logging.
 */
export interface Options {
    /**
     * The syslog host.
     */
    logHost: string;
    /**
     * The port to send to.
     */
    logPort: number;
    /**
     * Host in the syslog message.
     */
    host: string;
    /**
     * Application name. Limited to `/[a-z0-9-]+/`.
     */
    appName: string;
    /**
     * Application version. Such as hash or similar.
     */
    appVersion?: string;
    /**
     * How compliant the app is with our log definition.
     */
    compliance: Compliance;
    /**
     * Some secret sent as a tag to the syslog server.
     */
    apiKey: string;
    /**
     * Environment, such as 'production', 'testing', etc
     */
    env: string;
    /**
     * Do not log to console.log()
     */
    disableConsole?: boolean;
    /**
     * Do not add uuod msg.id to syslog
     */
    disableUuid?: boolean;
    /**
     * How long to wait before disconnecting the syslog server
     * connection due to being idle. Millis.
     */
    idleTimeout?: number;
    /**
     * If we are to disable tls. This should only be used for unit tests.
     */
    disableTls?: boolean;
}
export declare const isOptions: (t: any, reject?: (msg: string) => void) => t is Options;
/**
 * Create a logger from the options.
 */
export declare const createLogger: (opts: Options) => Logger;
/**
 * Create a logger that doesn't log to syslog. It does however log to console.
 */
export declare const createVoidLogger: (disableConsole?: boolean) => Logger;
export interface ProxyLogger extends Logger {
    setProxyTarget: (target: Logger) => void;
}
/**
 * Create a logger that proxies to another logger.
 */
export declare const createProxyLogger: (target: Logger) => ProxyLogger;
