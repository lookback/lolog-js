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
        client = yield driver_1.createClient(opts.logHost, opts.logPort, idleTimeout);
    });
    const clientLog = (severity, timestamp, message) => __awaiter(this, void 0, void 0, function* () {
        if (!client || !client.isConnected()) {
            yield connectClient();
        }
        yield client.send({
            facility,
            severity,
            timestamp,
            message,
            hostname: opts.host,
            appName: opts.appName,
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
        const logit = () => clientLog(syslogSeverity, timestamp, logRow);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0JBQXdDO0FBQ3hDLHVDQUFrRDtBQUNsRCxxQ0FBMEU7QUFFMUUsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBRXRELFFBQUEsZUFBZSxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUU7SUFDN0Msd0VBQXdFO0lBQ3hFLGdFQUFnRTtJQUNoRSxrQ0FBa0M7SUFDbEMsSUFBSSxNQUFNLEdBQWtCLElBQUksQ0FBQztJQUVqQyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksS0FBTSxDQUFDO0lBRS9DLHNCQUFzQjtJQUN0QixNQUFNLGFBQWEsR0FBRyxHQUFTLEVBQUU7UUFDN0IsTUFBTSxHQUFHLE1BQU0scUJBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFBLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRyxDQUNkLFFBQXdCLEVBQ3hCLFNBQWUsRUFDZixPQUFlLEVBQ0YsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxhQUFhLEVBQUUsQ0FBQztTQUN6QjtRQUNELE1BQU0sTUFBTyxDQUFDLElBQUksQ0FBQztZQUNmLFFBQVE7WUFDUixRQUFRO1lBQ1IsU0FBUztZQUNULE9BQU87WUFDUCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDbkIsT0FB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