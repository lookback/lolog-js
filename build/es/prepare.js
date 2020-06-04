import { isPlainObject } from './is-plain-object';
import { isWellKnown } from './is-well-known';
// tslint:disable no-object-mutation
/**
 * Enumeration of severities.
 */
export var Severity;
(function (Severity) {
    Severity["Trace"] = "TRACE";
    Severity["Debug"] = "DEBUG";
    Severity["Info"] = "INFO";
    Severity["Warn"] = "WARN";
    Severity["Error"] = "ERROR";
})(Severity || (Severity = {}));
/**
 * Helper to prepare a log message, rejecting it if it's not well formed.
 */
export const prepareLog = (severity, defaultAppName, args) => {
    if (args.length == 0) {
        console.log('Ignoring empty log row');
        return;
    }
    const message = String(args[0]);
    const wellRaw = args.length >= 2 ? args[1] : {};
    const dataRaw = args.length == 3 ? args[2] : {};
    // our own local copies, so we can delete without affecting the input
    const well = filterUnwanted(wellRaw);
    const data = filterUnwanted(dataRaw);
    // ensure wellknown really only contains well known fields
    if (!isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
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
export const serializeError = (err) => Object.assign.apply(null, (['name', 'message', 'stack']
    // Filter out unwanted
    .filter(k => isPrimitive(err[k]))
    // Create new object array and spread the array on the return object
    .map((k) => ({ [k]: err[k] }))));
/** Recursive helper to remove complex objects. */
// TODO fix for cyclic deps?
export const filterUnwanted = (oin) => {
    if (!isOk(oin))
        return undefined;
    if (oin instanceof Error) {
        return serializeError(oin);
    }
    if (Array.isArray(oin)) {
        return oin
            .map(a => filterUnwanted(a))
            .filter(a => a !== undefined);
    }
    else if (typeof oin === 'object') {
        const filtered = Object.entries(oin)
            .map(([k, v]) => ([k, filterUnwanted(v)]))
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
        if (Array.isArray(v) || isPlainObject(v) || v instanceof Error)
            return true;
        return false;
    }
    // string, boolean, number.
    return true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUMsb0NBQW9DO0FBR3BDOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksUUFNWDtBQU5ELFdBQVksUUFBUTtJQUNoQiwyQkFBZSxDQUFBO0lBQ2YsMkJBQWUsQ0FBQTtJQUNmLHlCQUFhLENBQUE7SUFDYix5QkFBYSxDQUFBO0lBQ2IsMkJBQWUsQ0FBQTtBQUNuQixDQUFDLEVBTlcsUUFBUSxLQUFSLFFBQVEsUUFNbkI7QUFnQkQ7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FDdEIsUUFBa0IsRUFDbEIsY0FBc0IsRUFDdEIsSUFBVyxFQUNZLEVBQUU7SUFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdEMsT0FBTztLQUNWO0lBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFaEQscUVBQXFFO0lBQ3JFLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxN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