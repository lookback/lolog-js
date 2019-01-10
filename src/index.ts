import { createSyslogger } from "./syslog";
import { createConsLogger } from "./conslog";
import { Severity, prepareLog } from "./prepare";
import { isBrowser } from "./is-browser";
import { createLogglyLogger } from "./loggly";

/**
 * The overloaded variants of logging.
 */
type LogFunction = {
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
export type Data = { [key: string]: any };

/**
 * Fields we together have decided the name of and are indexed for searching.
 */
export interface WellKnown {
    /**
     * Set log message timestamp with this. Millis since 1970.
     */
    timestamp: number;
    /**
     * Recording id.
     */
    recordingId?: string;
    /**
     * User id.
     */
    userId?: string;
    //
    // consult process to add more fields here.
    //
}

// keep in sync with interface definition
const WellKnown: { [k: string]: 'string' | 'number' | 'boolean' } = {
    timestamp: 'number',
    recordingId: 'string',
    userId: 'string',
};

/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
export const isWellKnown = (t: any, reject?: (msg: string) => void): t is WellKnown => {
    if (!t) {
        reject && reject(`"${t}" is not a value`);
        return false;
    }
    for (const f of Object.keys(t)) {
        const type = WellKnown[f];
        if (!type) {
            reject && reject(`${f} is not a well known field`);
            return false;
        }
        if ((typeof t[f]) !== type) {
            reject && reject(`${f} is not a ${type}`);
            return false;
        }
    }
    return true;
};

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
     * Create a sublogger that will be namespaced under this logger.
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
export enum Compliance {
    /**
     * For services that fully adhere to our levels. An `ERROR` level event means waking
     * up who is on call in the middle of the night. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local0`
     */
    Full = 'full',

    /**
     * For services that are somewhat compliant with the log levels. An `ERROR` level event
     * is not going to wake anyone up. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local1`
     */
    Mid = 'mid',

    /**
     * For services that have just been converted. Nothing is forwarded to our log web UI.
     * They are available via SSH on the log ingester.
     *
     * Use syslog facility `local2`
     */
    None = 'none',
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
     * Application name.
     */
    appName: string;

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
     * How long to wait before disconnecting the syslog server
     * connection due to being idle. Millis.
     */
    idleTimeout?: number;

    /**
     * If we are to disable tls. This should only be used for unit tests.
     */
    disableTls?: boolean;
}

/**
 * Create a logger from the options.
 */
export const createLogger = (opts: Options): Logger => {
    //
    // create the syslog instance
    const syslogger = isBrowser() ? createLogglyLogger(opts) : createSyslogger(opts);

    // for testing we can rig the output
    const output = (opts as any).__output || console;

    // to console
    const conslogger = opts.disableConsole ? null : createConsLogger(output);

    const relativeLogger = (namespace: string) => {
        // tslint:disable-next-line:no-let
        let sendDebug = false;
        const doLog = (severity: Severity, args: any[]) => {
            const prep = prepareLog(severity, namespace, args);
            if (!prep) return;
            if (!opts.disableConsole) {
                conslogger!(prep);
            }
            if (prep.severity != Severity.Trace && (prep.severity != Severity.Debug || sendDebug)) {
                syslogger(prep);
            }
        };
        return {
            trace: (...args: any[]) => doLog(Severity.Trace, args),
            debug: (...args: any[]) => doLog(Severity.Debug, args),
            info: (...args: any[]) => doLog(Severity.Info, args),
            warn: (...args: any[]) => doLog(Severity.Warn, args),
            error: (...args: any[]) => doLog(Severity.Error, args),
            sublogger: (sub: string) => relativeLogger(`${namespace}-${sub}`),
            setDebug: (debug: boolean) => {
                sendDebug = debug;
            },
        };
    };

    return relativeLogger(opts.appName);
};

