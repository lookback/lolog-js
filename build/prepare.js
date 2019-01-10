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
exports.prepareLog = (severity, appName, args) => {
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
        appName,
        message,
        merged,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQWdDO0FBRWhDOztHQUVHO0FBQ0gsSUFBWSxRQU1YO0FBTkQsV0FBWSxRQUFRO0lBQ2hCLDJCQUFlLENBQUE7SUFDZiwyQkFBZSxDQUFBO0lBQ2YseUJBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ25CLENBQUMsRUFOVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQU1uQjtBQWVEOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsQ0FDdEIsUUFBa0IsRUFDbEIsT0FBZSxFQUNmLElBQVcsRUFDWSxFQUFFO0lBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3RDLE9BQU87S0FDVjtJQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRTdDLDBEQUEwRDtJQUMxRCxJQUFJLENBQUMsY0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3ZFLE9BQU87S0FDVjtJQUVELG1FQUFtRTtJQUNuRSxNQUFNLElBQUkscUJBQVEsT0FBTyxDQUFFLENBQUM7SUFFNUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDL0MsOENBQThDO0lBQzlDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUV0QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7SUFDcEQsTUFBTSxNQUFNLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLG1CQUFNLElBQUksRUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUVwRixPQUFPO1FBQ0gsUUFBUTtRQUNSLFNBQVM7UUFDVCxPQUFPO1FBQ1AsT0FBTztRQUNQLE1BQU07S0FDVCxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=