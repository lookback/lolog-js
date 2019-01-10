"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syslog_1 = require("./syslog");
const conslog_1 = require("./conslog");
const prepare_1 = require("./prepare");
const is_browser_1 = require("./is-browser");
const loggly_1 = require("./loggly");
// keep in sync with interface definition
const WellKnown = {
    timestamp: 'number',
    recordingId: 'string',
    userId: 'string',
};
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
exports.isWellKnown = (t, reject) => {
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
/**
 * Create a logger from the options.
 */
exports.createLogger = (opts) => {
    //
    // create the syslog instance
    const syslogger = is_browser_1.isBrowser() ? loggly_1.createLogglyLogger(opts) : syslog_1.createSyslogger(opts);
    // for testing we can rig the output
    const output = opts.__output || console;
    // to console
    const conslogger = opts.disableConsole ? null : conslog_1.createConsLogger(output);
    const relativeLogger = (namespace) => {
        // tslint:disable-next-line:no-let
        let sendDebug = false;
        const doLog = (severity, args) => {
            const prep = prepare_1.prepareLog(severity, namespace, args);
            if (!prep)
                return;
            if (!opts.disableConsole) {
                conslogger(prep);
            }
            if (prep.severity != prepare_1.Severity.Trace && (prep.severity != prepare_1.Severity.Debug || sendDebug)) {
                syslogger(prep);
            }
        };
        return {
            trace: (...args) => doLog(prepare_1.Severity.Trace, args),
            debug: (...args) => doLog(prepare_1.Severity.Debug, args),
            info: (...args) => doLog(prepare_1.Severity.Info, args),
            warn: (...args) => doLog(prepare_1.Severity.Warn, args),
            error: (...args) => doLog(prepare_1.Severity.Error, args),
            sublogger: (sub) => relativeLogger(`${namespace}-${sub}`),
            setDebug: (debug) => {
                sendDebug = debug;
            },
        };
    };
    return relativeLogger(opts.appName);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBMkM7QUFDM0MsdUNBQTZDO0FBQzdDLHVDQUFpRDtBQUNqRCw2Q0FBeUM7QUFDekMscUNBQThDO0FBd0M5Qyx5Q0FBeUM7QUFDekMsTUFBTSxTQUFTLEdBQXFEO0lBQ2hFLFNBQVMsRUFBRSxRQUFRO0lBQ25CLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLE1BQU0sRUFBRSxRQUFRO0NBQ25CLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsV0FBVyxHQUFHLENBQUMsQ0FBTSxFQUFFLE1BQThCLEVBQWtCLEVBQUU7SUFDbEYsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNKLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMxQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBd0RGOztHQUVHO0FBQ0gsSUFBWSxVQXdCWDtBQXhCRCxXQUFZLFVBQVU7SUFDbEI7Ozs7O09B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