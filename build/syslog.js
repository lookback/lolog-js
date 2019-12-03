"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_browser_1 = __importDefault(require("is-browser"));
const uuid_1 = __importDefault(require("uuid"));
const _1 = require(".");
const prepare_1 = require("./prepare");
const driver_1 = require("./driver");
const wait = (ms) => new Promise(rs => setTimeout(rs, ms));
const DEFAULT_RETRY_WAIT = 3000;
const DEFAULT_RETRY_CUTOFF = 60000;
const makeSender = (opts) => {
    const retryWait = opts.retryWait || DEFAULT_RETRY_WAIT;
    const retryCutoff = opts.retryCutoff || DEFAULT_RETRY_CUTOFF;
    // create a new promise for client.
    const doCreateClient = () => driver_1.createClient({
        host: opts.logHost,
        port: opts.logPort,
        httpEndpoint: is_browser_1.default ? '/log' : undefined,
        useTls: !opts.disableTls,
        timeout: opts.idleTimeout || 10000,
    });
    // Promise for client holds the current client, or currently connecting client.
    // when failed will result in a reconnect. It's effectively a singleton that ensures
    // multiple log rows only cause/wait for one single socket connection.
    // tslint:disable-next-line:no-let
    let clientPromise = doCreateClient();
    // connect the client and send the message.
    return (toSend) => {
        // we use this for cutoff time for when to give up
        const timestamp = toSend.timestamp;
        const doSend = (attempts) => clientPromise
            .then((client) => {
            return client.send(toSend).then(() => ({
                attempts,
            }));
        })
            .catch((e) => {
            const retryable = Date.now() - timestamp.getTime() < (retryCutoff);
            if (retryable) {
                // replace clientPromise since this one is bust. this will ensure
                // only one failed sender will attempt to reconnect.
                clientPromise = new Promise((rs, rj) => wait(retryWait)
                    .then(doCreateClient)
                    .then(rs)
                    .catch(rj));
                // wait for promise to resolve and try send again.
                return doSend(attempts + 1);
            }
            else {
                // really do abort trying to send this line.
                throw {
                    attempts,
                    lastError: e,
                };
            }
        });
        return doSend(1);
    };
};
exports.createSyslogger = (opts) => {
    // sender that connects/reconnects and sends log rows.
    const sender = makeSender(opts);
    return (prep) => {
        const toSend = prepToSyslog(prep, opts);
        return sender(toSend)
            .catch((e) => {
            console.warn("Failed to send to syslog server", prep, e.lastError);
            return e;
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
const prepToSyslog = (prep, opts) => ({
    facility: selectFacility(opts.compliance),
    severity: selectSeverity(prep.severity),
    timestamp: new Date(prep.timestamp),
    message: prep.merged
        ? `${prep.message} ${JSON.stringify(prep.merged)}`
        : prep.message,
    hostname: opts.host,
    appName: prep.appName,
    msgId: !opts.disableUuid ? uuid_1.default.v4() : undefined,
    pid: opts.appVersion || process.pid,
    apiKeyId: opts.apiKeyId,
    apiKey: opts.apiKey,
    tags: {
        env: opts.env,
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFtQztBQUNuQyxnREFBd0I7QUFDeEIsd0JBQXdDO0FBQ3hDLHVDQUFrRDtBQUNsRCxxQ0FNa0I7QUFFbEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBUW5FLE1BQU0sa0JBQWtCLEdBQUcsSUFBSyxDQUFDO0FBQ2pDLE1BQU0sb0JBQW9CLEdBQUcsS0FBTSxDQUFDO0FBRXBDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBYSxFQUFtRCxFQUFFO0lBQ2xGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUM7SUFDdkQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxvQkFBb0IsQ0FBQztJQUU3RCxtQ0FBbUM7SUFDbkMsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQVksQ0FBQztRQUN0QyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1FBQ2xCLFlBQVksRUFBRSxvQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDNUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7UUFDeEIsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQUksS0FBTTtLQUN0QyxDQUFDLENBQUM7SUFFSCwrRUFBK0U7SUFDL0Usb0ZBQW9GO0lBQ3BGLHNFQUFzRTtJQUN0RSxrQ0FBa0M7SUFDbEMsSUFBSSxhQUFhLEdBQW9CLGNBQWMsRUFBRSxDQUFDO0lBRXRELDJDQUEyQztJQUMzQyxPQUFPLENBQUMs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