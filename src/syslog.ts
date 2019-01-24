import * as isBrowser from 'is-browser';
import * as uuid from 'uuid';
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

export const createSyslogger = (opts: Options): LoggerImpl => {
    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client: Client | null = null;

    const facility = selectFacility(opts.compliance);
    const idleTimeout = opts.idleTimeout || 10_000;

    // connect the client.
    const connectClient = async () => {
        const httpEndpoint = isBrowser ? '/log' : undefined;
        client = await createClient({
            host: opts.logHost,
            port: opts.logPort,
            httpEndpoint,
            useTls: !opts.disableTls,
            timeout: idleTimeout,
        });
    };

    const clientLog = async (
        severity: SyslogSeverity,
        env: string,
        appName: string,
        timestamp: Date,
        message: string,
    ): Promise<void> => {
        if (!client || !client.isConnected()) {
            await connectClient();
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
            logglyKey: opts.apiKey,
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

        const logit = () => clientLog(
            syslogSeverity,
            opts.env,
            prep.appName,
            timestamp,
            logRow
        );

        // log with retries
        logit().catch(e => {
            if (Date.now() - timestamp.getTime() > 60_000) {
                console.warn("Failed to send to syslog server", logRow, e);
                return;
            } else {
                return wait(3_000).then(logit);
            }
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
