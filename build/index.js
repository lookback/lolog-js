"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syslog_1 = require("./syslog");
const conslog_1 = require("./conslog");
const prepare_1 = require("./prepare");
// keep in sync with interface definition
const WellKnown = {
    recordingId: 'string',
    userId: 'string',
};
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
exports.isWellKnown = (t, reject) => {
    if (!!t) {
        reject && reject(`"${t}" is not a value`);
        return false;
    }
    for (const f in Object.keys(t)) {
        const type = WellKnown[f];
        if (!type) {
            reject && reject(`${t} is not a well known field`);
            return false;
        }
        if (typeof t !== type) {
            reject && reject(`${t} is not a ${type}`);
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
    Compliance[Compliance["Full"] = 0] = "Full";
    /**
     * For services that are somewhat compliant with the log levels. An `ERROR` level event
     * is not going to wake anyone up. Logs are forwarded to our log web UI.
     *
     * Use syslog facility `local1`
     */
    Compliance[Compliance["Mid"] = 1] = "Mid";
    /**
     * For services that have just been converted. Nothing is forwarded to our log web UI.
     * They are available via SSH on the log ingester.
     *
     * Use syslog facility `local2`
     */
    Compliance[Compliance["None"] = 2] = "None";
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
            conslog_1.consLogger(prep);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBMkM7QUFDM0MsdUNBQXVDO0FBQ3ZDLHVDQUFpRDtBQTRCakQseUNBQXlDO0FBQ3pDLE1BQU0sU0FBUyxHQUFxRDtJQUNoRSxXQUFXLEVBQUUsUUFBUTtJQUNyQixNQUFNLEVBQUUsUUFBUTtDQUNuQixDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxDQUFDLENBQU0sRUFBRSxNQUE4QixFQUFrQixFQUFFO0lBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNMLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxLQUFLLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDNUIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO0tBQ0o7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUEwQ0Y7Ozs7Y0FJYztBQUNkLElBQVksVUFzQlg7QUF0QkQsV0FBWSxVQUFVO0lBQ2xCOzs7OztPQUtHO0lBQ0gsMkNBQUksQ0FBQTtJQUNKOzs7OztPQUtHO0lBQ0gseUNBQUcsQ0FBQTtJQUNIOzs7OztPQUtHO0lBQ0gsMkNBQUksQ0FBQTtBQUNSLENBQUMsRUF0QlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFzQnJCO0FBNEJEOztHQUVHO0FBQ1UsUUFBQSxZQUFZLEdBQUcsQ0FBQyxJQUFhLEVBQVUsRUFBRTtJQUNsRCxNQUFNLFNBQVMsR0FBRyx3QkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLENBQUMsUUFBa0IsRUFBRSxJQUFXLEVBQUUsRUFBRTtRQUM5QyxNQUFNLElBQUksR0FBRyxvQkFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdEIsb0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQjtRQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUM7SUFDRixPQUFPO1FBQ0gsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7UUFDdEQsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7UUFDdEQsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7UUFDcEQsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7UUFDcEQsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7S0FDekQsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9