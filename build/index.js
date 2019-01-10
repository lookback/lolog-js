"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syslog_1 = require("./syslog");
const conslog_1 = require("./conslog");
const prepare_1 = require("./prepare");
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
    const syslogger = syslog_1.createSyslogger(opts);
    const doLog = (severity, args) => {
        const prep = prepare_1.prepareLog(severity, args);
        if (!prep)
            return;
        if (!opts.disableConsole) {
            // for testing we can rig the output
            const output = opts.__output || console;
            conslog_1.consLogger(prep, output);
        }
        syslogger(prep);
    };
    return {
        trace: (...args) => doLog(prepare_1.Severity.Trace, args),
        debug: (...args) => doLog(prepare_1.Severity.Debug, args),
        info: (...args) => doLog(prepare_1.Severity.Info, args),
        warn: (...args) => doLog(prepare_1.Severity.Warn, args),
        error: (...args) => doLog(prepare_1.Severity.Error, args),
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBMkM7QUFDM0MsdUNBQXVDO0FBQ3ZDLHVDQUFpRDtBQXdDakQseUNBQXlDO0FBQ3pDLE1BQU0sU0FBUyxHQUFxRDtJQUNoRSxTQUFTLEVBQUUsUUFBUTtJQUNuQixXQUFXLEVBQUUsUUFBUTtJQUNyQixNQUFNLEVBQUUsUUFBUTtDQUNuQixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxDQUFDLENBQU0sRUFBRSxNQUE4QixFQUFrQixFQUFFO0lBQ2xGLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDSixNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFDLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzVCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1AsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUNuRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUN4QixNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUM7WUFDMUMsT0FBTyxLQUFLLENBQUM7U0FDaEI7S0FDSjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQTBDRjs7OztjQUljO0FBQ2QsSUFBWSxVQXNCWDtBQXRCRCxXQUFZLFVBQVU7SUFDbEI7Ozs7O09BS0c7SUFDSCwyQkFBYSxDQUFBO0lBQ2I7Ozs7O09BS0c7SUFDSCx5QkFBVyxDQUFBO0lBQ1g7Ozs7O09BS0c7SUFDSCwyQkFBYSxDQUFBO0FBQ2pCLENBQUMsRUF0QlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFzQnJCO0FBeUNEOztHQUVHO0FBQ1UsUUFBQSxZQUFZLEdBQUcsQ0FBQyxJQUFhLEVBQVUsRUFBRTtJQUNsRCxNQUFNLFNBQVMsR0FBRyx3QkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLENBQUMsUUFBa0IsRUFBRSxJQUFXLEVBQUUsRUFBRTtRQUM5QyxNQUFNLElBQUksR0FBRyxvQkFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdEIsb0NBQW9DO1lBQ3BDLE1BQU0sTUFBTSxHQUFJLElBQVksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDO1lBQ2pELG9CQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztJQUNGLE9BQU87UUFDSCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUN0RCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztRQUN0RCxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUNwRCxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztRQUNwRCxLQUFLLEVBQUUsQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztLQUN6RCxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=