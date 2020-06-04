"use strict";
//! This is here to avoid circular builds for rollup
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The level of compliance with our defined log levels.
 */
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
     * For services that have just been converted. Logs are forwarded to our log web UI
     * and treated as plain text messages.
     *
     * Use syslog facility `local2`
     */
    Compliance["None"] = "none";
})(Compliance = exports.Compliance || (exports.Compliance = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxpYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wbGlhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvREFBb0Q7O0FBRXBEOztHQUVHO0FBQ0gsSUFBWSxVQXdCWDtBQXhCRCxXQUFZLFVBQVU7SUFDbEI7Ozs7O09BS0c7SUFDSCwyQkFBYSxDQUFBO0lBRWI7Ozs7O09BS0c7SUFDSCx5QkFBVyxDQUFBO0lBRVg7Ozs7O09BS0c7SUFDSCwyQkFBYSxDQUFBO0FBQ2pCLENBQUMsRUF4QlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUF3QnJCIn0=