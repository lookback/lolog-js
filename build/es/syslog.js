import isBrowser from 'is-browser';
import { Severity } from './prepare';
import { createClient, Facility, SyslogSeverity, } from './driver';
import { Compliance } from './compliance';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUM7QUFFbkMsT0FBTyxFQUFlLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNsRCxPQUFPLEVBRUgsWUFBWSxFQUNaLFFBQVEsRUFDUixjQUFjLEdBRWpCLE1BQU0sVUFBVSxDQUFDO0FBQ2xCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFMUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBUW5FLE1BQU0sa0JBQWtCLEdBQUcsSUFBSyxDQUFDO0FBQ2pDLE1BQU0sb0JBQW9CLEdBQUcsS0FBTSxDQUFDO0FBRXBDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBYSxFQUFtRCxFQUFFO0lBQ2xGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksa0JBQWtCLENBQUM7SUFDdkQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxvQkFBb0IsQ0FBQztJQUU3RCxtQ0FBbUM7SUFDbkMsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3RDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztRQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87UUFDbEIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzVDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVO1FBQ3hCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQU07S0FDdEMsQ0FBQyxDQUFDO0lBRUgsK0VBQStF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