"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_browser_1 = __importDefault(require("is-browser"));
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
    msgId: !opts.disableUuid ? exports.randomId(24) : undefined,
    pid: opts.appVersion || process.pid,
    apiKeyId: opts.apiKeyId,
    apiKey: opts.apiKey,
    tags: {
        env: opts.env,
    },
});
/** Deliberately not including easily confusable chars, 0, O, l, 1 etc */
const RANDOM_CHARS = 'abcdefghjkmnpqrstuvxyzABCDEFGHJKLMNPQRSTUVXYZ23456789';
/** Generate a mongo friendly random id */
exports.randomId = (length = 17) => Array.apply(null, { length })
    .map(() => RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)])
    .join('');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFtQztBQUVuQyx1Q0FBa0Q7QUFDbEQscUNBTWtCO0FBQ2xCLDZDQUEwQztBQUUxQyxNQUFNLElBQUksR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFRbkUsTUFBTSxrQkFBa0IsR0FBRyxJQUFLLENBQUM7QUFDakMsTUFBTSxvQkFBb0IsR0FBRyxLQUFNLENBQUM7QUFFcEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFhLEVBQW1ELEVBQUU7SUFDbEYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQztJQUN2RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLG9CQUFvQixDQUFDO0lBRTdELG1DQUFtQztJQUNuQyxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQkFBWSxDQUFDO1FBQ3RDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztRQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDbEIsWUFBWSxFQUFFLG9CQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztRQUM1QyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtRQUN4QixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFNO0tBQ3RDLENBQUMsQ0FBQztJQUVILCtFQUErRTtJQUMvRSxvRkFBb0Y7SUFDcEYsc0VBQXNFO0lBQ3RFLGtDQUFrQztJQUNsQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDekIsa0NBQWtDO0lBQ2xDLElBQUksYUFBYSxHQUFvQixjQUFjLEVBQUUs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