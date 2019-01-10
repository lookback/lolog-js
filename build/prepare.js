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
        return;
    }
    const message = String(args[0]);
    const well = args.length >= 2 ? args[1] : {};
    const data = args.length == 3 ? args[2] : {};
    const merged = Object.assign({}, well, { data });
    if (!_1.isWellKnown(well, (msg) => console.log('Ignoring log row:', msg))) {
        return;
    }
    return {
        severity,
        message,
        merged,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVwYXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQWdDO0FBRWhDOztHQUVHO0FBQ0gsSUFBWSxRQU1YO0FBTkQsV0FBWSxRQUFRO0lBQ2hCLDJCQUFlLENBQUE7SUFDZiwyQkFBZSxDQUFBO0lBQ2YseUJBQWEsQ0FBQTtJQUNiLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ25CLENBQUMsRUFOVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQU1uQjtBQWFEOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsQ0FBQyxRQUFrQixFQUFFLElBQVcsRUFBMkIsRUFBRTtJQUNuRixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2xCLE9BQU87S0FDVjtJQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDN0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRTdDLE1BQU0sTUFBTSxxQkFBUSxJQUFJLElBQUUsSUFBSSxHQUFFLENBQUM7SUFFakMsSUFBSSxDQUFDLGNBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUNwRSxPQUFPO0tBQ1Y7SUFFRCxPQUFPO1FBQ0gsUUFBUTtRQUNSLE9BQU87UUFDUCxNQUFNO0tBQ1QsQ0FBQztBQUNOLENBQUMsQ0FBQyJ9