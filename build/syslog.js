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
const isBrowser = require("is-browser");
const uuid = require("uuid");
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
        const useWebSocket = isBrowser;
        client = yield driver_1.createClient({
            host: opts.logHost,
            port: opts.logPort,
            useWebSocket,
            useTls: !opts.disableTls,
            timeout: idleTimeout,
        });
    });
    const clientLog = (severity, env, appName, timestamp, message) => __awaiter(this, void 0, void 0, function* () {
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
            msgId: !opts.disableUuid ? uuid.v4() : undefined,
            pid: process.pid,
            logglyKey: opts.apiKey,
            tags: {
                env,
            },
        });
    });
    return (prep) => {
        // the severity will be mapped to some syslog severity.
        const syslogSeverity = selectSeverity(prep.severity);
        // the row with the data to log
        const logRow = prep.merged
            ? `${prep.message} ${JSON.stringify(prep.merged)}`
            : prep.message;
        const timestamp = new Date(prep.timestamp);
        const logit = () => clientLog(syslogSeverity, opts.env, prep.appName, timestamp, logRow);
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
        case prepare_1.Severity.Trace: return driver_1.SyslogSeverity.Debug;
        case prepare_1.Severity.Debug: return driver_1.SyslogSeverity.Debug;
        case prepare_1.Severity.Info: return driver_1.SyslogSeverity.Informational;
        case prepare_1.Severity.Warn: return driver_1.SyslogSeverity.Warning;
        case prepare_1.Severity.Error: return driver_1.SyslogSeverity.Error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0JBQXdDO0FBQ3hDLHVDQUFrRDtBQUNsRCxxQ0FBMEU7QUFDMUUsd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUU3QixNQUFNLElBQUksR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFJdEQsUUFBQSxlQUFlLEdBQUcsQ0FBQyxJQUFhLEVBQWMsRUFBRTtJQUN6RCx3RUFBd0U7SUFDeEUsZ0VBQWdFO0lBQ2hFLGtDQUFrQztJQUNsQyxJQUFJLE1BQU0sR0FBa0IsSUFBSSxDQUFDO0lBRWpDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFNLENBQUM7SUFFL0Msc0JBQXNCO0lBQ3RCLE1BQU0sYUFBYSxHQUFHLEdBQVMsRUFBRTtRQUM3QixNQUFNLFlBQVksR0FBRyxTQUFTLENBQUM7UUFDL0IsTUFBTSxHQUFHLE1BQU0scUJBQVksQ0FBQztZQUN4QixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ2xCLFlBQVk7WUFDWixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUN4QixPQUFPLEVBQUUsV0FBVztTQUN2QixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUEsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLENBQ2QsUUFBd0IsRUFDeEIsR0FBVyxFQUNYLE9BQWUsRUFDZixTQUFlLEVBQ2YsT0FBZSxFQUNGLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMs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