"use strict";
// tslint:disable no-object-mutation
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
/**
 * Enumeration of severities.
 */
var Severity;
(function (Severity) {
    Severity["Trace"] = "TRACE";
    Severity["Debug"] = "DEBUG";
    Severity["Info"] = "INFO";
    Severity["Warn"] = "WARN";
    Severity["Error"] = "ERROR";
})(Severity = exports.Severity || (exports.Severity = {}));
/**
 * Helper to prepare a log message, rejecting it if it's not well formed.
 */
exports.prepareLog = (severity, appName, args) => {
    if (args.length == 0) {
        console.log('Ignoring empty log row');
        return;
    }
    const message = String(args[0]);
    const wellRaw = args.length >= 2 ? args[1] : {};
    const dataRaw = args.length == 3 ? args[2] : {};
    // our own local copies, so we can delete without affecting the input
    const well = filterUndefined(wellRaw);
    const data = filterUndefined(dataRaw);
    // ensure well know really only contains well known fields
    if (!_1.isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }
    const timestamp = well.timestamp || Date.now();
    delete well.timestamp;
    const dataLen = Object.keys(data).length;
    const mergaroo = Object.assign({}, well, (dataLen ? { data } : {}));
    const merged = Object.keys(mergaroo).length ? mergaroo : undefined;
    return {
        severity,
        timestamp,
        appName,
        message,
        merged,
    };
};
// delete any undefined/null etc values
const filterUndefined = (oin) => {
    const o = Object.assign({}, oin);
    for (const k of Object.keys(o)) {
        const v = o[k];
        if (v == null) { // deliberate ==
            delete o[k];
        }
    }
    return o;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQ0FBb0M7O0FBRXBDLHdCQUFnQztBQUVoQzs7R0FFRztBQUNILElBQVksUUFNWDtBQU5ELFdBQVksUUFBUTtJQUNoQiwyQkFBZSxDQUFBO0lBQ2YsMkJBQWUsQ0FBQTtJQUNmLHlCQUFhLENBQUE7SUFDYix5QkFBYSxDQUFBO0lBQ2IsMkJBQWUsQ0FBQTtBQUNuQixDQUFDLEVBTlcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFNbkI7QUFlRDs7R0FFRztBQUNVLFFBQUEsVUFBVSxHQUFHLENBQ3RCLFFBQWtCLEVBQ2xCLE9BQWUsRUFDZixJQUFXLEVBQ1ksRUFBRTtJQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN0QyxPQUFPO0tBQ1Y7SUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVoRCxxRUFBcUU7SUFDckUsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV0QywwREFBMEQ7SUFDMUQsSUFBSSxDQUFDLGNBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNwRSxPQUFPO0tBQ1Y7SUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFFdEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDekMsTUFBTSxRQUFRLHFCQUFnQyxJQUFJLEVBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFFLENBQUM7SUFFbkYsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBRW5FLE9BQU87UUFDSCxRQUFRO1FBQ1IsU0FBUztRQUNULE9BQU87UUFDUCxPQUFPO1FBQ1AsTUFBTTtLQUNULENBQUM7QUFDTixDQUFDLENBQUM7QUFFRix1Q0FBdUM7QUFDdkMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFRLEVBQU8sRUFBRTtJQUN0QyxNQUFNLENBQUMscUJBQVEsR0FBRyxDQUFFLENBQUM7SUFDckIsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLGdCQUFnQjtZQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNmO0tBQ0o7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUMsQ0FBQyJ9