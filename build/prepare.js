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
    // ensure wellknown really only contains well known fields
    if (!_1.isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQWtEO0FBQ2xELHdCQUFnQztBQUNoQyxvQ0FBb0M7QUFHcEM7O0dBRUc7QUFDSCxJQUFZLFFBTVg7QUFORCxXQUFZLFFBQVE7SUFDaEIsMkJBQWUsQ0FBQTtJQUNmLDJCQUFlLENBQUE7SUFDZix5QkFBYSxDQUFBO0lBQ2IseUJBQWEsQ0FBQTtJQUNiLDJCQUFlLENBQUE7QUFDbkIsQ0FBQyxFQU5XLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBTW5CO0FBZ0JEOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsQ0FDdEIsUUFBa0IsRUFDbEIsY0FBc0IsRUFDdEIsSUFBVyxFQUNZLEVBQUU7SUFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdEMsT0FBTztLQUNWO0lBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFaEQscUVBQXFFO0lBQ3JFLE1BQU0sSUFBSSxHQUFHLHNCQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsTUFBTSxJQUFJLEdBQUcsc0JBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVyQywwREFBMEQ7SUFDMUQsSUFBSSxDQUFD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