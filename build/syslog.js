"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const prepare_1 = require("./prepare");
const driver_1 = require("./driver");
const is_browser_1 = require("./is-browser");
const wait = (ms) => new Promise(rs => setTimeout(rs, ms));
exports.createSyslogger = (opts) => {
    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client = null;
    const facility = selectFacility(opts.compliance);
    const idleTimeout = opts.idleTimeout || 10000;
    // connect the client.
    const connectClient = () => __awaiter(this, void 0, void 0, function* () {
        const useWebSocket = is_browser_1.isBrowser();
        client = yield driver_1.createClient({
            host: opts.logHost,
            port: opts.logPort,
            useWebSocket,
            useTls: !opts.disableTls,
            timeout: idleTimeout,
        });
    });
    const clientLog = (severity, appName, timestamp, message) => __awaiter(this, void 0, void 0, function* () {
        if (!client || !client.isConnected()) {
            yield connectClient();
        }
        yield client.send({
            facility,
            severity,
            timestamp,
            message,
            hostname: opts.host,
            appName,
            pid: process.pid,
            logglyKey: opts.apiKey,
        });
    });
    return (prep) => {
        // the severity will be mapped to some syslog severity.
        const syslogSeverity = selectSeverity(prep.severity);
        // might be null for TRACE.
        if (!syslogSeverity)
            return;
        // the row with the data to log
        const logRow = prep.merged
            ? `${prep.message} ${JSON.stringify(prep.merged)}`
            : prep.message;
        const timestamp = new Date(prep.timestamp);
        const logit = () => clientLog(syslogSeverity, prep.appName, timestamp, logRow);
        // log with retries
        logit().catch(e => {
            if (Date.now() - timestamp.getTime() > 60000) {
                console.warn("Failed to send to syslog server", logRow, e);
                return;
            }
            else {
                return wait(3000).then(logit);
            }
        });
    };
};
const selectFacility = (c) => {
    switch (c) {
        case _1.Compliance.Full: return driver_1.Facility.Local0;
        case _1.Compliance.Mid: return driver_1.Facility.Local1;
        case _1.Compliance.None: return driver_1.Facility.Local2;
    }
};
const selectSeverity = (s) => {
    switch (s) {
        case prepare_1.Severity.Trace: return null; // we don't map TRACE to syslog server
        case prepare_1.Severity.Debug: return driver_1.SyslogSeverity.Debug;
        case prepare_1.Severity.Info: return driver_1.SyslogSeverity.Informational;
        case prepare_1.Severity.Warn: return driver_1.SyslogSeverity.Warning;
        case prepare_1.Severity.Error: return driver_1.SyslogSeverity.Error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0JBQXdDO0FBQ3hDLHVDQUFrRDtBQUNsRCxxQ0FBMEU7QUFDMUUsNkNBQXlDO0FBRXpDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUl0RCxRQUFBLGVBQWUsR0FBRyxDQUFDLElBQWEsRUFBYyxFQUFFO0lBQ3pELHdFQUF3RTtJQUN4RSxnRUFBZ0U7SUFDaEUsa0NBQWtDO0lBQ2xDLElBQUksTUFBTSxHQUFrQixJQUFJLENBQUM7SUFFakMsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQU0sQ0FBQztJQUUvQyxzQkFBc0I7SUFDdEIsTUFBTSxhQUFhLEdBQUcsR0FBUyxFQUFFO1FBQzdCLE1BQU0sWUFBWSxHQUFHLHNCQUFTLEVBQUUsQ0FBQztRQUNqQyxNQUFNLEdBQUcsTUFBTSxxQkFBWSxDQUFDO1lBQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztZQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbEIsWUFBWTtZQUNaLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ3hCLE9BQU8sRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQSxDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsQ0FDZCxRQUF3QixFQUN4QixPQUFlLEVBQ2YsU0FBZSxFQUNmLE9BQWUsRUFDRixFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVB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