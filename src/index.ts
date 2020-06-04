import { createConsLogger } from './conslog';
import { createSyslogger, LoggerImpl, LogResult } from './syslog';
import { mkValidator } from './validator';
import { prepareLog, Severity } from './prepare';
import { Compliance } from './compliance';

export { isWellKnown } from './is-well-known';
export { Compliance } from './compliance';

export { serializeError } from './prepare';

/**
 * The overloaded variants of logging.
 */
export type LogFunction = {
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
     * Recording id.
     */
    recordingId?: string;

    /**
     * User id.
     */
    userId?: string;

    /**
     * Team id.
     */
    teamId?: string;

    /**
     * Ip address of user in question. Be very restrictive with logging this.
     */
    userIp?: string;

    /**
     * Id of a session grouping a number of log rows. The specific meaning is
     * to be defined by subsystem. In dormammu it is what used to be called
     * connectionId (or sometimes peerId): an id per connection that changes
     * on every reconnect. In umar it is per replay session. Consecutive replays
     * would cause different sessionId.
     */
    sessionId?: string;

    /**
     * Numeric values under the `data: {}` section are treated as metrics belonging
     * to this metric group.
     */
    metricGroup?: string;

    //
    // consult process to add more fields here.
    //
}

export interface LocalWellKnown extends WellKnown {
    /**
     * Set log message timestamp with this. Millis since 1970.
     * This is _NOT_ a WellKnown field for lolog server. It's simply here
     * for convenience in the lolog-js API.
     */
    timestamp?: number;

    /**
     * Override the app name for this log row. This is so we can do
     * `audit.ultron`.
     */
    appName?: string;

    /**
     * Disable console log for this message. Useful for telemetry etc.
     */
    disableConsole?: boolean;
}

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
     * Create a new root logger that will start a new namespace.  Limited to `/[a-z0-9-]+/`.
     */
    rootLogger: (appName: string) => Logger;

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
     * Identifier of the secret sent to the syslog server.
     */
    apiKeyId: string;

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

    /**
     * Milliseconds between retrying a failed syslog connection.
     */
    retryWait?: number;


    /**
     * Milliseconds when to give up retrying altogether.
     */
    retryCutoff?: number;
}

const ValidOptions = {
    logHost: 'string',
    logPort: 'number',
    host: 'string',
    appName: 'string',
    appVersion: 'string',
    compliance: 'string',
    apiKeyId: 'string',
    apiKey: 'string',
    env: 'string',
    disableConsole: 'boolean',
    disableUuid: 'boolean',
    idleTimeout: 'number',
    disableTls: 'boolean',
    retryWait: 'number',
    retryCutoff: 'number',
};

export const createOptionsFromEnv = (): Pick<
    Options,
    'logHost' | 'logPort' | 'apiKeyId' | 'apiKey' | 'disableTls'
> => ({
    logHost: getEnv('SYSLOG_HOST'),
    logPort: parseInt(getEnv('SYSLOG_PORT'), 10),
    apiKeyId: getEnv('SYSLOG_API_KEY_ID'),
    apiKey: getEnv('SYSLOG_API_KEY'),
    disableTls: !process.env.SYSLOG_TLS,
});

const getEnv = (n: string): string => {
    const x = process.env[n];
    if (!x) {
        throw new Error(`Missing env var: ${n}`);
    }
    return x;
};

export const isOptions: (t: any, reject?: (msg: string) => void) => t is Options
    = mkValidator(ValidOptions, [
        'logHost', 'logPort', 'host', 'appName', 'compliance', 'apiKeyId', 'apiKey', 'env',
    ]);

/** Helper to remove unwanted chars from namespaces */
const filterNs = (sub: string) => sub.toLowerCase().replace(/[^a-z0-9-]/g, '');

/** Exported log result for use in tests. */
// tslint:disable-next-line:no-let
export let __lastLogResult: Promise<LogResult> | null = null;

// create a logger for a namespace
const mkNnsLogger = (
    syslogger: LoggerImpl | null,
    conslogger: LoggerImpl | null,
) => {
    const nsLogger = (namespace: string) => {
        // tslint:disable-next-line:no-let
        let sendDebug = false;
        const doLog = (severity: Severity, args: any[]) => {
            const prep = prepareLog(severity, namespace, args);
            if (!prep) return;
            if (conslogger && !prep.disableConsole) {
                __lastLogResult = conslogger!(prep);
            }
            if (syslogger != null &&
                // never syslog TRACE
                prep.severity != Severity.Trace &&
                // only syslog DEBUG if sendDebug flag
                (prep.severity != Severity.Debug || sendDebug)) {
                __lastLogResult = syslogger(prep);
            }
        };
        return {
            trace: (...args: any[]) => doLog(Severity.Trace, args),
            debug: (...args: any[]) => doLog(Severity.Debug, args),
            info: (...args: any[]) => doLog(Severity.Info, args),
            warn: (...args: any[]) => doLog(Severity.Warn, args),
            error: (...args: any[]) => doLog(Severity.Error, args),
            sublogger: (sub: string) => nsLogger(`${namespace}.${filterNs(sub)}`),
            rootLogger: (appName: string) => nsLogger(filterNs(appName)),
            setDebug: (debug: boolean) => {
                sendDebug = debug;
            },
        };
    };
    return nsLogger;
};

/**
 * Create a logger from the options.
 */
export const createLogger = (opts: Options): Logger => {

    isOptions(opts, (msg) => {
        throw new Error(`Invalid options: ${msg}`);
    });

    // create the syslog instance
    const syslogger = createSyslogger(opts);

    // for testing we can rig the output
    const output = (opts as any).__output || console;

    // to console
    const conslogger = opts.disableConsole ? null : createConsLogger(output);

    // the name spaced logger
    const nsLogger = mkNnsLogger(syslogger, conslogger);

    return nsLogger(filterNs(opts.appName));
};


/**
 * Create a logger that doesn't log to syslog. It does however log to console.
 */
export const createVoidLogger = (disableConsole = false): Logger => {

    // to console
    const conslogger = disableConsole ? null : createConsLogger(console);

    // the name spaced logger
    const nsLogger = mkNnsLogger(null, conslogger);

    return nsLogger(filterNs('app'));
};

export interface ProxyLogger extends Logger {
    setProxyTarget: (target: Logger) => void;
}

/**
 * Create a logger that proxies to another logger.
 */
export const createProxyLogger = (target: Logger): ProxyLogger => {
    // tslint:disable-next-line:no-let
    let t = target;
    const dependent: { [sub: string]: ProxyLogger } = {};
    const createDependent = (n: string, actual: Logger): ProxyLogger => {
        const existing = dependent[n];
        if (existing) {
            return existing;
        }
        const proxy = createProxyLogger(actual);
        // tslint:disable-next-line: no-object-mutation
        dependent[n] = proxy;
        return proxy;
    };
    return {
        trace: (...args: any[]) => t.trace.apply(t, args),
        debug: (...args: any[]) => t.debug.apply(t, args),
        info: (...args: any[]) => t.info.apply(t, args),
        warn: (...args: any[]) => t.warn.apply(t, args),
        error: (...args: any[]) => t.error.apply(t, args),
        sublogger: (sub: string) => {
            const actual = t.sublogger.call(t, sub);
            return createDependent(sub, actual);
        },
        rootLogger: (appName: string) => {
            const actual = t.rootLogger.call(t, appName);
            return createDependent(`ROOT_${appName}`, actual);
        },
        setDebug: (debug: boolean) => t.setDebug.call(t, debug),
        setProxyTarget(target: Logger): void {
            t = target;
            Object.entries(dependent).forEach(([n, logger]) => {
                const newDep = n.startsWith('ROOT_')
                    ? target.rootLogger(n.substring(5))
                    : target.sublogger(n);
                logger.setProxyTarget(newDep);
            });
        },
    };
};
