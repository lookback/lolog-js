import { Options, Compliance } from ".";
import { PreparedLog, Severity } from "./prepare";

const syslog = require("syslog-client");

const wait = (ms: number) => new Promise(rs => setTimeout(rs, ms));

export const createSyslogger = (opts: Options) => {
    const sopts = {
        port: opts.logPort,
        syslogHostname: opts.host,
        transport: syslog.Transport.Tcp,
        facility: selectFacility(opts.compliance),
        rfc3164: false,
        appName: opts.appName,
    };

    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client: any = null;

    // disconnect the client and null the field
    const disconnectClient = () => {
        if (!client) return;
        client.removeAllListeners();
        client.close();
        client = null;
    };

    // connect the client.
    const connectClient = () => {
        client = syslog.createClient(opts.logHost, sopts);
        client.once('close', disconnectClient);
        client.once('error', disconnectClient);
    };

    const clientLog = (
        severity: any,
        message: string,
        timestamp: Date
    ): Promise<void> => new Promise((rs, rj) => {
        if (!client) {
            connectClient();
        }
        client.log(message, { severity, timestamp }, (err: Error) => {
            if (err) {
                rj(err);
            } else {
                rs();
            }
        });
    });

    return (prep: PreparedLog) => {
        // the severity will be mapped to some syslog severity.
        const syslogSeverity = selectSeverity(prep.severity);

        // might be null for TRACE.
        if (!syslogSeverity) return;

        // the row with the data to log
        const logRow = prep.merged
            ? `${prep.message} ${JSON.stringify(prep.merged)}`
            : prep.message;
        const timestamp = new Date(prep.timestamp);

        const logit = () => clientLog(syslogSeverity, logRow, timestamp);

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

const selectFacility = (c: Compliance): any => {
    switch (c) {
        case Compliance.Full: return syslog.Facility.Local0;
        case Compliance.Mid: return syslog.Facility.Local1;
        case Compliance.None: return syslog.Facility.Local2;
    }
};

const selectSeverity = (s: Severity): any => {
    switch (s) {
        case Severity.Trace: return null; // we don't map TRACE to syslog server
        case Severity.Debug: return syslog.Severity.Debug;
        case Severity.Info: return syslog.Severity.Informational;
        case Severity.Warn: return syslog.Severity.Warning;
        case Severity.Error: return syslog.Severity.Error;
    }
};
