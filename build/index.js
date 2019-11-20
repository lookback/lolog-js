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
    recordingId: 'string',
    userId: 'string',
    userIp: 'string',
    sessionId: 'string',
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
     * For services that have just been converted. Nothing is forwarded to our log web UI.
     * They are available via SSH on the log ingester.
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
// create a logger for a namespace
const mkNnsLogger = (syslogger, conslogger) => {
    const nsLogger = (namespace) => {
        // tslint:disable-next-line:no-let
        let sendDebug = false;
        const doLog = (severity, args) => {
            const prep = prepare_1.prepareLog(severity, namespace, args);
            if (!prep)
                return;
            if (conslogger) {
                conslogger(prep);
            }
            if (syslogger != null &&
                // never syslog TRACE
                prep.severity != prepare_1.Severity.Trace &&
                // only syslog DEBUG if sendDebug flag
                (prep.severity != prepare_1.Severity.Debug || sendDebug)) {
                syslogger(prep);
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
    return {
        trace: (...args) => t.trace.apply(t, args),
        debug: (...args) => t.debug.apply(t, args),
        info: (...args) => t.info.apply(t, args),
        warn: (...args) => t.warn.apply(t, args),
        error: (...args) => t.error.apply(t, args),
        sublogger: (sub) => t.sublogger.call(t, sub),
        setDebug: (debug) => t.setDebug.call(t, debug),
        setProxyTarget(target) {
            t = target;
        },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBNkM7QUFDN0MscUNBQXVEO0FBQ3ZELDJDQUEwQztBQUMxQyx1Q0FBaUQ7QUFFakQscUNBQTJDO0FBQWxDLG1DQUFBLGNBQWMsQ0FBQTtBQTZEdkIseUNBQXlDO0FBQ3pDLE1BQU0sU0FBUyxHQUFxRDtJQUNoRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixXQUFXLEVBQUUsUUFBUTtJQUNyQixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsUUFBUTtDQUN0QixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FDbEIsdUJBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXdEN0I7O0dBRUc7QUFDSCxJQUFZLFVBd0JYO0FBeEJELFdBQVksVUFBVTtJQUNsQjs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7SUFFYjs7Ozs7T0FLRztJQUNILHlCQUFXLENBQUE7SUFFWDs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7QUFDakIsQ0FBQyxFQXhCVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQXdCckI7QUF5RUQsTUFBTSxZQUFZLEdBQUc7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsSUFBSSxFQUFFLFFBQVE7SUFDZCxPQUFPLEVBQUUsUUFBUTtJQUNqQixVQUFVLEVBQUUsUUFBUTtJQUNwQixVQUFVLEVBQUUsUUFBUTtJQUNwQixRQUFRLEVBQUUsUUFBUTtJQUNsQixNQUFNLEVBQUUsUUFBUTtJQUNoQixHQUFHLEVBQUUsUUFBUTtJQUNiLGNBQWMsRUFBRSxTQUFTO0lBQ3pCLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLFVBQVUsRUFBRSxTQUFTO0NBQ3hCLENBQUM7QUFFVyxRQUFBLG9C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