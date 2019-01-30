"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isBrowser = require("is-browser");
const conslog_1 = require("./conslog");
const loggly_1 = require("./loggly");
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
    apiKey: 'string',
    env: 'string',
    disableConsole: 'boolean',
    disableUuid: 'boolean',
    idleTimeout: 'number',
    disableTls: 'boolean',
};
exports.isOptions = validator_1.mkValidator(ValidOptions, [
    'logHost', 'logPort', 'host', 'appName', 'compliance', 'apiKey', 'env',
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
    // TODO remove the loggly logger here when we are rolled out with our own ingester.
    // const syslogger = createSyslogger(opts);
    const syslogger = isBrowser ? loggly_1.createLogglyLogger(opts) : syslog_1.createSyslogger(opts);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMsdUNBQTZDO0FBQzdDLHFDQUE4QztBQUM5QyxxQ0FBdUQ7QUFDdkQsMkNBQTBDO0FBQzFDLHVDQUFpRDtBQUVqRCxxQ0FBMkM7QUFBbEMsbUNBQUEsY0FBYyxDQUFBO0FBZ0R2Qix5Q0FBeUM7QUFDekMsTUFBTSxTQUFTLEdBQXFEO0lBQ2hFLFNBQVMsRUFBRSxRQUFRO0lBQ25CLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLE1BQU0sRUFBRSxRQUFRO0NBQ25CLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsV0FBVyxHQUNsQix1QkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBd0Q3Qjs7R0FFRztBQUNILElBQVksVUF3Qlg7QUF4QkQsV0FBWSxVQUFVO0lBQ2xCOzs7OztPQUtHO0lBQ0gsMkJBQWEsQ0FBQTtJQUViOzs7OztPQUtHO0lBQ0gseUJBQVcsQ0FBQTtJQUVYOzs7OztPQUtHO0lBQ0gsMkJBQWEsQ0FBQTtBQUNqQixDQUFDLEVBeEJXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBd0JyQjtBQW9FRCxNQUFNLFlBQVksR0FBRztJQUNqQixPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsUUFBUTtJQUNqQixJQUFJLEVBQUUsUUFBUTtJQUNkLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLFVBQVUsRUFBRSxRQUFRO0lBQ3BCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLEdBQUcsRUFBRSxRQUFRO0lBQ2IsY0FBYyxFQUFFLFNBQVM7SUFDekIsV0FBVyxFQUFFLFNBQVM7SUFDdEIsV0FBVyxFQUFFLFFBQVE7SUFDckIsVUFBVSxFQUFFLFNBQVM7Q0FDeEIsQ0FBQztBQUVXLFFBQUEsU0FBUyxHQUNoQix1QkFBVyxD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