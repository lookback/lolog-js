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
 *
- `local1` is
- `local2`  */
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
    // for server side
    const syslogger = is_browser_1.isBrowser() ? null : syslog_1.createSyslogger(opts);
    // for browser side
    const logglylogger = is_browser_1.isBrowser() ? loggly_1.createLogglyLogger(opts) : null;
    // for testing we can rig the output
    const output = opts.__output || console;
    // to console
    const conslogger = opts.disableConsole ? null : conslog_1.createConsLogger(output);
    const doLog = (severity, args) => {
        const prep = prepare_1.prepareLog(severity, args);
        if (!prep)
            return;
        if (!opts.disableConsole) {
            conslogger(prep);
        }
        if (is_browser_1.isBrowser()) {
            // FIXME this is temporary until we got our own syslog host.
            logglylogger(prep);
        }
        else {
            syslogger(prep);
        }
    };
    return {
        trace: (...args) => doLog(prepare_1.Severity.Trace, args),
        debug: (...args) => doLog(prepare_1.Severity.Debug, args),
        info: (...args) => doLog(prepare_1.Severity.Info, args),
        warn: (...args) => doLog(prepare_1.Severity.Warn, args),
        error: (...args) => doLog(prepare_1.Severity.Error, args),
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBMkM7QUFDM0MsdUNBQTZDO0FBQzdDLHVDQUFpRDtBQUNqRCw2Q0FBeUM7QUFDekMscUNBQThDO0FBd0M5Qyx5Q0FBeUM7QUFDekMsTUFBTSxTQUFTLEdBQXFEO0lBQ2hFLFNBQVMsRUFBRSxRQUFRO0lBQ25CLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLE1BQU0sRUFBRSxRQUFRO0NBQ25CLENBQUM7QUFFRjs7R0FFRztBQUNVLFFBQUEsV0FBVyxHQUFHLENBQUMsQ0FBTSxFQUFFLE1BQThCLEVBQWtCLEVBQUU7SUFDbEYsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNKLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMxQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBMENGOzs7O2NBSWM7QUFDZCxJQUFZLFVBc0JYO0FBdEJELFdBQVksVUFBVTtJQUNsQjs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7SUFDYjs7Ozs7T0FLRztJQUNILHlCQUFXLENBQUE7SUFDWDs7Ozs7T0FLRztJQUNILDJCQUFhLENBQUE7QUFDakIsQ0FBQyxFQXRCVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQXNCckI7QUE2Q0Q7O0dBRUc7QUFDVSxRQUFBLFlBQVksR0FBRyxDQUFDLElBQWEsRUFBVSxFQUFFO0lBQ2xELEVBQUU7SUFDRixrQkFBa0I7SUFDbEIsTUFBTSxTQUFTLEdBQUcsc0JBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHdCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFN0QsbUJBQW1CO0lBQ25CLE1BQU0sWUFBWSxHQUFHLHNCQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsMkJBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVuRSxvQ0FBb0M7SUFDcEMsTUFBTSxNQUFNLEdBQUksSUFBWSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUM7SUFFakQsYUFBYTtJQUNiLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsMEJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFekUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxRQUFrQixFQUFFLElBQVcsRUFBRSxFQUFFO1FBQzlDLE1BQU0sSUFBSSxHQUFHLG9CQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN0QixVQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckI7UUFDRCxJQUFJLHNCQUFTLEVBQUUsRUFBRTtZQUNiLDREQUE0RDtZQUM1RCxZQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNILFNBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQjtJQUNMLENBQUMsQ0FBQztJQUNGLE9BQU87UUFDSCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUN0RCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUN0RCxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUNwRCxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUNwRCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztLQUN6RCxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=