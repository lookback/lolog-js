"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conslog_1 = require("./conslog");
const syslog_1 = require("./syslog");
const validator_1 = require("./validator");
const prepare_1 = require("./prepare");
var prepare_2 = require("./prepare");
exports.serializeError = prepare_2.serializeError;
// keep in sync with interface definition
const WellKnown = {
    timestamp: 'number',
    appName: 'string',
    recordingId: 'string',
    userId: 'string',
    teamId: 'string',
    userIp: 'string',
    sessionId: 'string',
    metricGroup: 'string',
    disableConsole: 'boolean',
};
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
exports.isWellKnown = validator_1.mkValidator(WellKnown);
/**
 * The level of compliance with our defined log levels.
 */
var Compliance;
(function (Compliance) {
    /**
     * For services that fully adhere to our levels. An `ERROR` level event means waking
     * up who is on call in the middle of the night. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local0`
     */
    Compliance["Full"] = "full";
    /**
     * For services that are somewhat compliant with the log levels. An `ERROR` level event
     * is not going to wake anyone up. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local1`
     */
    Compliance["Mid"] = "mid";
    /**
     * For services that have just been converted. Logs are forwarded to our log web UI
     * and treated as plain text messages.
     *
     * Use syslog facility `local2`
     */
    Compliance["None"] = "none";
})(Compliance = exports.Compliance || (exports.Compliance = {}));
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
exports.createOptionsFromEnv = () => ({
    logHost: getEnv('SYSLOG_HOST'),
    logPort: parseInt(getEnv('SYSLOG_PORT'), 10),
    apiKeyId: getEnv('SYSLOG_API_KEY_ID'),
    apiKey: getEnv('SYSLOG_API_KEY'),
    disableTls: !process.env.SYSLOG_TLS,
});
const getEnv = (n) => {
    const x = process.env[n];
    if (!x) {
        throw new Error(`Missing env var: ${n}`);
    }
    return x;
};
exports.isOptions = validator_1.mkValidator(ValidOptions, [
    'logHost', 'logPort', 'host', 'appName', 'compliance', 'apiKeyId', 'apiKey', 'env',
]);
/** Helper to remove unwanted chars from namespaces */
const filterNs = (sub) => sub.toLowerCase().replace(/[^a-z0-9-]/g, '');
/** Exported log result for use in tests. */
// tslint:disable-next-line:no-let
exports.__lastLogResult = null;
// create a logger for a namespace
const mkNnsLogger = (syslogger, conslogger) => {
    const nsLogger = (namespace) => {
        // tslint:disable-next-line:no-let
        let sendDebug = false;
        const doLog = (severity, args) => {
            const prep = prepare_1.prepareLog(severity, namespace, args);
            if (!prep)
                return;
            if (conslogger && !prep.disableConsole) {
                exports.__lastLogResult = conslogger(prep);
            }
            if (syslogger != null &&
                // never syslog TRACE
                prep.severity != prepare_1.Severity.Trace &&
                // only syslog DEBUG if sendDebug flag
                (prep.severity != prepare_1.Severity.Debug || sendDebug)) {
                exports.__lastLogResult = syslogger(prep);
            }
        };
        return {
            trace: (...args) => doLog(prepare_1.Severity.Trace, args),
            debug: (...args) => doLog(prepare_1.Severity.Debug, args),
            info: (...args) => doLog(prepare_1.Severity.Info, args),
            warn: (...args) => doLog(prepare_1.Severity.Warn, args),
            error: (...args) => doLog(prepare_1.Severity.Error, args),
            sublogger: (sub) => nsLogger(`${namespace}.${filterNs(sub)}`),
            setDebug: (debug) => {
                sendDebug = debug;
            },
        };
    };
    return nsLogger;
};
/**
 * Create a logger from the options.
 */
exports.createLogger = (opts) => {
    exports.isOptions(opts, (msg) => {
        throw new Error(`Invalid options: ${msg}`);
    });
    // create the syslog instance
    const syslogger = syslog_1.createSyslogger(opts);
    // for testing we can rig the output
    const output = opts.__output || console;
    // to console
    const conslogger = opts.disableConsole ? null : conslog_1.createConsLogger(output);
    // the name spaced logger
    const nsLogger = mkNnsLogger(syslogger, conslogger);
    return nsLogger(filterNs(opts.appName));
};
/**
 * Create a logger that doesn't log to syslog. It does however log to console.
 */
exports.createVoidLogger = (disableConsole = false) => {
    // to console
    const conslogger = disableConsole ? null : conslog_1.createConsLogger(console);
    // the name spaced logger
    const nsLogger = mkNnsLogger(null, conslogger);
    return nsLogger(filterNs('app'));
};
/**
 * Create a logger that proxies to another logger.
 */
exports.createProxyLogger = (target) => {
    // tslint:disable-next-line:no-let
    let t = target;
    const subloggers = {};
    return {
        trace: (...args) => t.trace.apply(t, args),
        debug: (...args) => t.debug.apply(t, args),
        info: (...args) => t.info.apply(t, args),
        warn: (...args) => t.warn.apply(t, args),
        error: (...args) => t.error.apply(t, args),
        sublogger: (sub) => {
            const existing = subloggers[sub];
            if (existing) {
                return existing;
            }
            const actual = t.sublogger.call(t, sub);
            const proxy = exports.createProxyLogger(actual);
            // tslint:disable-next-line: no-object-mutation
            subloggers[sub] = proxy;
            return proxy;
        },
        setDebug: (debug) => t.setDebug.call(t, debug),
        setProxyTarget(target) {
            t = target;
            Object.entries(subloggers).forEach(([sub, logger]) => {
                const newSub = target.sublogger(sub);
                logger.setProxyTarget(newSub);
            });
        },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBNkM7QUFDN0MscUNBQWtFO0FBQ2xFLDJDQUEwQztBQUMxQyx1Q0FBaUQ7QUFFakQscUNBQTJDO0FBQWxDLG1DQUFBLGNBQWMsQ0FBQTtBQW1GdkIseUNBQXlDO0FBQ3pDLE1BQU0sU0FBUyxHQUFxRDtJQUNoRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixPQUFPLEVBQUUsUUFBUTtJQUNqQixXQUFXLEVBQUUsUUFBUTtJQUNyQixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsUUFBUTtJQUNuQixXQUFXLEVBQUUsUUFBUTtJQUNyQixjQUFjLEVBQUUsU0FBUztDQUM1QixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FDbEIsdUJBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXdEN0I7O0dBRUc7QUFDSCxJQUFZLFVBd0JYO0FBeEJELFdBQVksVUFBVTtJQUNsQjs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7SUFFYjs7Ozs7T0FLRztJQUNILHlCQUFXLENBQUE7SUFFWDs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7QUFDakIsQ0FBQyxFQXhCVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQXdCckI7QUFvRkQsTUFBTSxZQUFZLEdBQUc7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsSUFBSSxFQUFFLFFBQVE7SUFDZCxPQUFPLEVBQUUsUUFBUTtJQUNqQixVQUFVLEVBQUUsUUFBUTtJQUNwQixVQUFVLEVBQUUsUUFBUTtJQUNwQixRQUFRLEVBQUUsUUFBUTtJQUNsQixNQUFNLEVBQUUsUUFBUTtJQUNoQixHQUFHLEVBQUUsUUFBUTtJQUNiLGNBQWMsRUFBRSxTQUFTO0lB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