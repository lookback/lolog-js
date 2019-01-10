"use strict";
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
exports.prepareLog = (severity, args) => {
    if (args.length == 0) {
        console.log('Ignoring empty log row');
        return;
    }
    const message = String(args[0]);
    const wellRaw = args.length >= 2 ? args[1] : {};
    const data = args.length == 3 ? args[2] : {};
    // ensure well know really only contains well known fields
    if (!_1.isWellKnown(wellRaw, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }
    // our own local copy, so we can delete without affecting the input
    const well = Object.assign({}, wellRaw);
    const timestamp = well.timestamp || Date.now();
    // tslint:disable-next-line:no-object-mutation
    delete well.timestamp;
    const dataLen = Object.keys(data).length;
    const mergeLen = Object.keys(well).length + dataLen;
    const merged = mergeLen > 0 ? Object.assign({}, well, (dataLen ? { data } : {})) : undefined;
    return {
        severity,
        timestamp,
        message,
        merged,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQWdDO0FBRWhDOztHQUVHO0FBQ0gsSUFBWSxRQU1YO0FBTkQsV0FBWSxRQUFRO0lBQ2hCLDJCQUFlLENBQUE7SUFDZiwyQkFBZSxDQUFBO0lBQ2YseUJBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ25CLENBQUMsRUFOVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQU1uQjtBQWNEOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsQ0FBQyxRQUFrQixFQUFFLElBQVcsRUFBMkIsRUFBRTtJQUNuRixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN0QyxPQUFPO0tBQ1Y7SUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2hELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUU3QywwREFBMEQ7SUFDMUQsSUFBSSxDQUFDLGNBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUN2RSxPQUFPO0tBQ1Y7SUFFRCxtRUFBbUU7SUFDbkUsTUFBTSxJQUFJLHFCQUFRLE9BQU8sQ0FBRSxDQUFDO0lBRTVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQy9DLDhDQUE4QztJQUM5QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFFdEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDekMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO0lBQ3BELE1BQU0sTUFBTSxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxtQkFBTSxJQUFJLEVBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFFcEYsT0FBTztRQUNILFFBQVE7UUFDUixTQUFTO1FBQ1QsT0FBTztRQUNQLE1BQU07S0FDVCxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=