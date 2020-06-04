"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_plain_object_1 = require("./is-plain-object");
const is_well_known_1 = require("./is-well-known");
// tslint:disable no-object-mutation
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
exports.prepareLog = (severity, defaultAppName, args) => {
    if (args.length == 0) {
        console.log('Ignoring empty log row');
        return;
    }
    const message = String(args[0]);
    const wellRaw = args.length >= 2 ? args[1] : {};
    const dataRaw = args.length == 3 ? args[2] : {};
    // our own local copies, so we can delete without affecting the input
    const well = exports.filterUnwanted(wellRaw);
    const data = exports.filterUnwanted(dataRaw);
    // ensure wellknown really only contains well known fields
    if (!is_well_known_1.isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }
    const timestamp = well.timestamp || Date.now();
    delete well.timestamp;
    const appName = well.appName || defaultAppName;
    delete well.appName;
    const disableConsole = !!well.disableConsole;
    delete well.disableConsole;
    const dataLen = Object.keys(data).length;
    const mergaroo = Object.assign(Object.assign({}, well), (dataLen ? { data } : {}));
    const merged = Object.keys(mergaroo).length ? mergaroo : undefined;
    return {
        severity,
        timestamp,
        appName,
        message,
        merged,
        disableConsole,
    };
};
const isPrimitive = (val) => ['number', 'string', 'boolean'].includes(typeof val);
/** Serialize and Error to a plain object, keeping commonly used properties. */
exports.serializeError = (err) => Object.assign.apply(null, (['name', 'message', 'stack']
    // Filter out unwanted
    .filter(k => isPrimitive(err[k]))
    // Create new object array and spread the array on the return object
    .map((k) => ({ [k]: err[k] }))));
/** Recursive helper to remove complex objects. */
// TODO fix for cyclic deps?
exports.filterUnwanted = (oin) => {
    if (!isOk(oin))
        return undefined;
    if (oin instanceof Error) {
        return exports.serializeError(oin);
    }
    if (Array.isArray(oin)) {
        return oin
            .map(a => exports.filterUnwanted(a))
            .filter(a => a !== undefined);
    }
    else if (typeof oin === 'object') {
        const filtered = Object.entries(oin)
            .map(([k, v]) => ([k, exports.filterUnwanted(v)]))
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => ({ [k]: v }));
        return Object.assign({}, ...filtered);
    }
    return oin;
};
/** Check if a single value is something we want. */
const isOk = (v) => {
    if (v == undefined)
        return false; // deliberately non-strict equality
    if (typeof v === 'object') {
        // null, array, plain or complex object
        if (Array.isArray(v) || is_plain_object_1.isPlainObject(v) || v instanceof Error)
            return true;
        return false;
    }
    // string, boolean, number.
    return true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQWtEO0FBQ2xELG1EQUE4QztBQUM5QyxvQ0FBb0M7QUFHcEM7O0dBRUc7QUFDSCxJQUFZLFFBTVg7QUFORCxXQUFZLFFBQVE7SUFDaEIsMkJBQWUsQ0FBQTtJQUNmLDJCQUFlLENBQUE7SUFDZix5QkFBYSxDQUFBO0lBQ2IseUJBQWEsQ0FBQTtJQUNiLDJCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQU5XLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0FBZ0JEOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsQ0FDdEIsUUFBa0IsRUFDbEIsY0FBc0IsRUFDdEIsSUFBVyxFQUNZLEVBQUU7SUFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdEMsT0FBTztLQUNWO0lBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFaEQscUVBQXFFO0lBQ3JFLE1BQU0sSUFBSSxHQUFHLHNCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsTUFBTSxJQUFJLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVyQywwREFBMEQ7SUFDMUQsSUFBSSxD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