"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_plain_object_1 = require("./is-plain-object");
const _1 = require(".");
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
    // ensure well know really only contains well known fields
    if (!_1.isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }
    const timestamp = well.timestamp || Date.now();
    delete well.timestamp;
    const appName = well.appName || defaultAppName;
    delete well.appName;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQWtEO0FBQ2xELHdCQUFnQztBQUNoQyxvQ0FBb0M7QUFHcEM7O0dBRUc7QUFDSCxJQUFZLFFBTVg7QUFORCxXQUFZLFFBQVE7SUFDaEIsMkJBQWUsQ0FBQTtJQUNmLDJCQUFlLENBQUE7SUFDZix5QkFBYSxDQUFBO0lBQ2IseUJBQWEsQ0FBQTtJQUNiLDJCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQU5XLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0FBZUQ7O0dBRUc7QUFDVSxRQUFBLFVBQVUsR0FBRyxDQUN0QixRQUFrQixFQUNsQixjQUFzQixFQUN0QixJQUFXLEVBQ1ksRUFBRTtJQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN0QyxPQUFPO0tBQ1Y7SUFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVoRCxxRUFBcUU7SUFDckUsTUFBTSxJQUFJLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxNQUFNLElBQUksR0FBRyxzQkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXJDLDBEQUEwRDtJQUMxRCxJQUFJLENBQUMs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