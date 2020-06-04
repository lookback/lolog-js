import { Severity } from './prepare';
import { createClient, Facility, SyslogSeverity, } from './driver';
import { Compliance } from './compliance';
import { isBrowser } from './is-browser';
const wait = (ms) => new Promise(rs => setTimeout(rs, ms));
const DEFAULT_RETRY_WAIT = 3000;
const DEFAULT_RETRY_CUTOFF = 60000;
const makeSender = (opts) => {
    const retryWait = opts.retryWait || DEFAULT_RETRY_WAIT;
    const retryCutoff = opts.retryCutoff || DEFAULT_RETRY_CUTOFF;
    // create a new promise for client.
    const doCreateClient = () => createClient({
        host: opts.logHost,
        port: opts.logPort,
        httpEndpoint: isBrowser ? '/log' : undefined,
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
export const createSyslogger = (opts) => {
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
        case Compliance.Full: return Facility.Local0;
        case Compliance.Mid: return Facility.Local1;
        case Compliance.None: return Facility.Local2;
    }
};
const selectSeverity = (s) => {
    switch (s) {
        case Severity.Trace: return SyslogSeverity.Debug;
        case Severity.Debug: return SyslogSeverity.Debug;
        case Severity.Info: return SyslogSeverity.Informational;
        case Severity.Warn: return SyslogSeverity.Warning;
        case Severity.Error: return SyslogSeverity.Error;
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
    msgId: !opts.disableUuid ? randomId(24) : undefined,
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
export const randomId = (length = 17) => Array.apply(null, { length })
    .map(() => RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)])
    .join('');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQWUsUUFBUSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2xELE9BQU8sRUFFSCxZQUFZLEVBQ1osUUFBUSxFQUNSLGNBQWMsR0FFakIsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQVFuRSxNQUFNLGtCQUFrQixHQUFHLElBQUssQ0FBQztBQUNqQyxNQUFNLG9CQUFvQixHQUFHLEtBQU0sQ0FBQztBQUVwQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQWEsRUFBbUQsRUFBRTtJQUNsRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLGtCQUFrQixDQUFDO0lBQ3ZELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksb0JBQW9CLENBQUM7SUFFN0QsbUNBQW1DO0lBQ25DLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztRQUN0QyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1FBQ2xCLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztRQUM1QyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtRQUN4QixPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFNO0tBQ3RDLENBQUMsQ0FBQztJ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