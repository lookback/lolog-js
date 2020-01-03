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
            if (conslogger) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBNkM7QUFDN0MscUNBQWtFO0FBQ2xFLDJDQUEwQztBQUMxQyx1Q0FBaUQ7QUFFakQscUNBQTJDO0FBQWxDLG1DQUFBLGNBQWMsQ0FBQTtBQW1FdkIseUNBQXlDO0FBQ3pDLE1BQU0sU0FBUyxHQUFxRDtJQUNoRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixPQUFPLEVBQUUsUUFBUTtJQUNqQixXQUFXLEVBQUUsUUFBUTtJQUNyQixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsUUFBUTtDQUN0QixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FDbEIsdUJBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQXdEN0I7O0dBRUc7QUFDSCxJQUFZLFVBd0JYO0FBeEJELFdBQVksVUFBVTtJQUNsQjs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7SUFFYjs7Ozs7T0FLRztJQUNILHlCQUFXLENBQUE7SUFFWDs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7QUFDakIsQ0FBQyxFQXhCVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQXdCckI7QUFvRkQsTUFBTSxZQUFZLEdBQUc7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsSUFBSSxFQUFFLFFBQVE7SUFDZCxPQUFPLEVBQUUsUUFBUTtJQUNqQixVQUFVLEVBQUUsUUFBUTtJQUNwQixVQUFVLEVBQUUsUUFBUTtJQUNwQixRQUFRLEVBQUUsUUFBUTtJQUNsQixNQUFNLEVBQUUsUUFBUTtJQUNoQixHQUFHLEVBQUUsUUFBUTtJQUNiLGNBQWMsRUFBRSxTQUFTO0lBQ3pCLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLFdBQVcsRUFBRSxRQUFRO0NBQ3hCLENBQUM7QUFFVyxRQUFBLG9CQUFvQixHQUFHLEdBR2xDLEVBQUUsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDOUIsT0FBTyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQzVDLFFBQVEsRUFBRSxNQUFNLENBQUMsbUJBQW1CLENBQUM7SUFDckMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUNoQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7Q0FDdEMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFTLEVBQVUsRUFBRTtJQUNqQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDSixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVDO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDLENBQUM7QUFFVyxRQUFBLFNBQVMsR0FDaEIsdUJBQVcsQ0FBQyxZQUFZLEVBQUU7SUFDeEIsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEtBQUs7Q0FDckYsQ0FBQyxDQUFDO0FBRVAsc0RBQXNEO0FBQ3RELE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUUvRSw0Q0FBNEM7QUFDNUMsa0NBQWtDO0FBQ3ZCLFFBQUEsZUFBZSxHQUE4QixJQUFJLENBQUM7QUFFN0Qsa0NBQWtDO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLENBQ2hCLFNBQTRCLEVBQzVCLFVBQTZCLEVBQy9CLEVBQUU7SUFDQSxNQUFNLFFBQVEsR0FBRyxDQUFDLFNBQWlCLEVBQUUsRUFBRTtRQUNuQyxrQ0FBa0M7UUFDbEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLENBQUMsUUFBa0IsRUFBRSxJQUFXLEVBQUUsRUFBRTtZQUM5QyxNQUFNLElBQUksR0FBRyxvQkFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUNsQixJQUFJLFVBQVUsRUFBRTtnQkFDWix1QkFBZSxHQUFHLFVBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QztZQUNELElBQUksU0FBUyxJQUFJLElBQUk7Z0JBQ2pCLHFCQUFxQjtnQkFDckIsSUFBSSxDQUFDLFFBQVEsSUFBSSxrQkFBUSxDQUFDLEtBQUs7Z0JBQy9CLHNDQUFzQztnQkFDdEMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLGtCQUFRLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxFQUFFO2dCQUNoRCx1QkFBZSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQztRQUNMLENBQUMsQ0FBQztRQUNGLE9BQU87WUFDSCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztZQUN0RCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztZQUN0RCxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNwRCxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUNwRCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztZQUN0RCxTQUFTLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNyRSxRQUFRLEVBQUUsQ0FBQyxLQUFjLEVBQUUsRUFBRTtnQkFDekIsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN0QixDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUMsQ0FBQztJQUNGLE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ1UsUUFBQSxZQUFZLEdBQUcsQ0FBQyxJQUFhLEVBQVUsRUFBRTtJQUVsRCxpQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCw2QkFBNkI7SUFDN0IsTUFBTSxTQUFTLEdBQUcsd0JBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV4QyxvQ0FBb0M7SUFDcEMsTUFBTSxNQUFNLEdBQUksSUFBWSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUM7SUFFakQsYUFBYTtJQUNiLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsMEJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFekUseUJBQXlCO0lBQ3pCLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFcEQsT0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQztBQUdGOztHQUVHO0FBQ1UsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLGNBQWMsR0FBRyxLQUFLLEVBQVUsRUFBRTtJQUUvRCxhQUFhO0lBQ2IsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDBCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXJFLHlCQUF5QjtJQUN6QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRS9DLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQU1GOztHQUVHO0FBQ1UsUUFBQSxpQkFBaUIsR0FBRyxDQUFDLE1BQWMsRUFBZSxFQUFFO0lBQzdELGtDQUFrQztJQUNsQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDZixPQUFPO1FBQ0gsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDakQsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDakQsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDL0MsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDL0MsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDakQsU0FBUyxFQUFFLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ3BELFFBQVEsRUFBRSxDQUFDLEtBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUN2RCxjQUFjLENBQUMsTUFBYztZQUN6QixDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2YsQ0FBQztLQUNKLENBQUM7QUFDTixDQUFDLENBQUMifQ==