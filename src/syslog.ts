import isBrowser from 'is-browser';
import uuid from 'uuid';
import { Compliance, Options } from '.';
import { PreparedLog, Severity } from './prepare';
import {
    Client,
    createClient,
    Facility,
    SyslogSeverity,
} from './driver';

const wait = (ms: number) => new Promise(rs => setTimeout(rs, ms));

export type LoggerImpl = (prep: PreparedLog) => void;

const RETRY_CUTOFF = 60_000;
const RETRY_WAIT = 3_000;

export const createSyslogger = (opts: Options): LoggerImpl => {
    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client: Client | null = null;

    const facility = selectFacility(opts.compliance);
    const idleTimeout = opts.idleTimeout || 10_000;

    // connect the client.
    const connectClient = async (timestamp: Date) => {
        const httpEndpoint = isBrowser ? '/log' : undefined;
        const doCreate = () => createClient({
            host: opts.logHost,
            port: opts.logPort,
            httpEndpoint,
            useTls: !opts.disableTls,
            timeout: idleTimeout,
        });
        client = await doCreate()
        .catch(e => {
            if (Date.now() - timestamp.getTime() > RETRY_CUTOFF) {
                throw e;
            } else {
                return wait(RETRY_WAIT).then(doCreate);
            }
        });
    };

    const clientLog = async (
        severity: SyslogSeverity,
        env: string,
        appName: string,
        timestamp: Date,
        message: string,
    ): Promise<void> => {
        // tslint:disable-next-line:no-let
        let connectErr = null;
        if (!client || !client.isConnected()) {
            await connectClient(timestamp).catch(e => {
                connectErr = e;
            });
        }
        if (connectErr != null) {
            throw connectErr;
        }
        await client!.send({
            facility,
            severity,
            timestamp,
            message,
            hostname: opts.host,
            appName,
            msgId: !opts.disableUuid ? uuid.v4() : undefined,
            pid: opts.appVersion || process.pid,
            apiKeyId: opts.apiKeyId,
            apiKey: opts.apiKey,
            tags: {
                env,
            },
        });
    };

    return (prep: PreparedLog) => {
        // the severity will be mapped to some syslog severity.
        const syslogSeverity = selectSeverity(prep.severity);

        // the row with the data to log
        const logRow = prep.merged
            ? `${prep.message} ${JSON.stringify(prep.merged)}`
            : prep.message;
        const timestamp = new Date(prep.timestamp);

        const logit = (): Promise<any> => clientLog(
            syslogSeverity,
            opts.env,
            prep.appName,
            timestamp,
            logRow
        )
        .catch(e => {
            if (Date.now() - timestamp.getTime() > RETRY_CUTOFF) {
                console.warn("Failed to send to syslog server", logRow, e);
                return;
            } else {
                return wait(RETRY_WAIT).then(logit);
            }
        });

        // log with retries
        logit();
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
