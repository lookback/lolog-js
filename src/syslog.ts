import isBrowser from 'is-browser';
import uuid from 'uuid';
import { Compliance, Options } from '.';
import { PreparedLog, Severity } from './prepare';
import {
    Client,
    createClient,
    Facility,
    SyslogSeverity,
    SyslogMessage,
} from './driver';

const wait = (ms: number) => new Promise(rs => setTimeout(rs, ms));

export interface LogResult {
    lastError?: Error;
    attempts: number;
}
export type LoggerImpl = (prep: PreparedLog) => Promise<LogResult>;

const DEFAULT_RETRY_WAIT = 3_000;
const DEFAULT_RETRY_CUTOFF = 60_000;

const makeSender = (opts: Options): ((toSend: SyslogMessage) => Promise<LogResult>) => {
    const retryWait = opts.retryWait || DEFAULT_RETRY_WAIT;
    const retryCutoff = opts.retryCutoff || DEFAULT_RETRY_CUTOFF;

    // create a new promise for client.
    const doCreateClient = () => createClient({
        host: opts.logHost,
        port: opts.logPort,
        httpEndpoint: isBrowser ? '/log' : undefined,
        useTls: !opts.disableTls,
        timeout: opts.idleTimeout || 10_000,
    });

    // Promise for client holds the current client, or currently connecting client.
    // when failed will result in a reconnect. It's effectively a singleton that ensures
    // multiple log rows only cause/wait for one single socket connection.
    // tslint:disable-next-line:no-let
    let clientPending = true;
    // tslint:disable-next-line:no-let
    let clientPromise: Promise<Client> = doCreateClient();

    // connect the client and send the message.
    return (toSend: SyslogMessage): Promise<LogResult> => {
        // we use this for cutoff time for when to give up
        const timestamp = toSend.timestamp!;

        const doSend = (attempts: number): Promise<LogResult> => clientPromise
            .then((client: Client) => {
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
                            .catch(rj));
                    }
                    // wait for promise to resolve and try send again.
                    return doSend(attempts + 1);
                } else {
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

export const createSyslogger = (opts: Options): LoggerImpl => {
    // sender that connects/reconnects and sends log rows.
    const sender = makeSender(opts);

    return (prep: PreparedLog) => {
        const toSend = prepToSyslog(prep, opts);
        return sender(toSend)
            .catch((e: LogResult) => {
                console.warn("Failed to send to syslog server", prep, e.lastError);
                return e;
            });
    };
};

const selectFacility = (c: Compliance): Facility => {
    switch (c) {
        case Compliance.Full: return Facility.Local0;
        case Compliance.Mid: return Facility.Local1;
        case Compliance.None: return Facility.Local2;
    }
};

const selectSeverity = (s: Severity): SyslogSeverity => {
    switch (s) {
        case Severity.Trace: return SyslogSeverity.Debug;
        case Severity.Debug: return SyslogSeverity.Debug;
        case Severity.Info: return SyslogSeverity.Informational;
        case Severity.Warn: return SyslogSeverity.Warning;
        case Severity.Error: return SyslogSeverity.Error;
    }
};

const prepToSyslog = (prep: PreparedLog, opts: Options): SyslogMessage => ({
    facility: selectFacility(opts.compliance),
    severity: selectSeverity(prep.severity),
    timestamp: new Date(prep.timestamp),
    message: prep.merged
        ? `${prep.message} ${JSON.stringify(prep.merged)}`
        : prep.message,
    hostname: opts.host,
    appName: prep.appName,
    msgId: !opts.disableUuid ? uuid.v4() : undefined,
    pid: opts.appVersion || process.pid,
    apiKeyId: opts.apiKeyId,
    apiKey: opts.apiKey,
    tags: {
        env: opts.env,
    },
});
