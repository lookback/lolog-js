"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_browser_1 = __importDefault(require("is-browser"));
const uuid_1 = __importDefault(require("uuid"));
const prepare_1 = require("./prepare");
const driver_1 = require("./driver");
const compliance_1 = require("./compliance");
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
    let clientPending = true;
    // tslint:disable-next-line:no-let
    let clientPromise = doCreateClient();
    // connect the client and send the message.
    return (toSend) => {
        // we use this for cutoff time for when to give up
        const timestamp = toSend.timestamp;
        const doSend = (attempts) => clientPromise
            .then((client) => {
            clientPending = false;
            return client.send(toSend).then(() => ({
                attempts,
            }));
        })
            .catch((e) => {
            const retryable = Date.now() - timestamp.getTime() < (retryCutoff);
            if (retryable) {
                if (!clientPending) {
                    clientPending = true;
                    // replace clientPromise since this one is bust. this will ensure
                    // only one failed sender will attempt to reconnect.
                    clientPromise = new Promise((rs, rj) => wait(retryWait)
                        .then(doCreateClient)
                        .then(rs)
                        .catch(e => {
                        clientPending = false;
                        rj(e);
                    }));
                }
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
        case compliance_1.Compliance.Full: return driver_1.Facility.Local0;
        case compliance_1.Compliance.Mid: return driver_1.Facility.Local1;
        case compliance_1.Compliance.None: return driver_1.Facility.Local2;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFtQztBQUNuQyxnREFBd0I7QUFFeEIsdUNBQWtEO0FBQ2xELHFDQU1rQjtBQUNsQiw2Q0FBMEM7QUFFMUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBUW5FLE1BQU0sa0JBQWtCLEdBQUcsSUFBSyxDQUFDO0FBQ2pDLE1BQU0sb0JBQW9CLEdBQUcsS0FBTSxDQUFDO0FBRXBDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBYSxFQUFtRCxFQUFFO0lBQ2xGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUM7SUFDdkQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxvQkFBb0IsQ0FBQztJQUU3RCxtQ0FBbUM7SUFDbkMsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQVksQ0FBQztRQUN0QyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1FBQ2xCLFlBQVksRUFBRSxvQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDNUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7UUFDeEIsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQUksS0FBTTtLQUN0QyxDQUFDLENBQUM7SUFFSCwrRUFBK0U7SUFDL0Usb0ZBQW9GO0lBQ3BGLHNFQUFzRTtJQUN0RSxrQ0FBa0M7SUFDbEMsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLGtDQUFrQztJQUNsQyxJQUFJLGFBQWEsR0FBb0Is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