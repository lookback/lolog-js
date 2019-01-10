"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const prepare_1 = require("./prepare");
const syslog = require("syslog-client");
const wait = (ms) => new Promise(rs => setTimeout(rs, ms));
exports.createSyslogger = (opts) => {
    const sopts = {
        syslogHostname: opts.host,
        port: opts.port,
        transport: syslog.Transport.Tcp,
        facility: selectFacility(opts.compliance),
        rfc3164: false,
        appName: opts.appName,
    };
    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client = null;
    // disconnect the client and null the field
    const disconnectClient = () => {
        if (!client)
            return;
        client.removeAllListeners();
        client.close();
        client = null;
    };
    // connect the client.
    const connectClient = () => {
        client = syslog.createClient(sopts);
        client.once('close', disconnectClient);
        client.once('error', disconnectClient);
    };
    const clientLog = (severity, message, timestamp) => new Promise((rs, rj) => {
        if (!client) {
            connectClient();
        }
        client.log(message, { severity, timestamp }, (err) => {
            if (err) {
                rj(err);
            }
            else {
                rs();
            }
        });
    });
    return (prep) => {
        // the severity will be mapped to some syslog severity.
        const syslogSeverity = selectSeverity(prep.severity);
        // might be null for TRACE.
        if (!!syslogSeverity)
            return;
        // the row with the data to log
        const logRow = `${prep.message} ${JSON.stringify(prep.merged)}`;
        const timestamp = new Date();
        const logit = () => clientLog(syslogSeverity, logRow, timestamp);
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
        case _1.Compliance.Full: return syslog.Facility.Local0;
        case _1.Compliance.Mid: return syslog.Facility.Local1;
        case _1.Compliance.None: return syslog.Facility.Local2;
    }
};
const selectSeverity = (s) => {
    switch (s) {
        case prepare_1.Severity.Trace: return null; // we don't map TRACE to syslog server
        case prepare_1.Severity.Debug: return syslog.Severity.Debug;
        case prepare_1.Severity.Info: return syslog.Severity.Informational;
        case prepare_1.Severity.Warn: return syslog.Severity.Warning;
        case prepare_1.Severity.Error: return syslog.Severity.Error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdCQUF3QztBQUN4Qyx1Q0FBa0Q7QUFFbEQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRXhDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUV0RCxRQUFBLGVBQWUsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFO0lBQzdDLE1BQU0sS0FBSyxHQUFHO1FBQ1YsY0FBYyxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtRQUNmLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7UUFDL0IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pDLE9BQU8sRUFBRSxLQUFLO1FBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO0tBQ3hCLENBQUM7SUFFRix3RUFBd0U7SUFDeEUsZ0VBQWdFO0lBQ2hFLGtDQUFrQztJQUNsQyxJQUFJLE1BQU0sR0FBUSxJQUFJLENBQUM7SUFFdkIsMkNBQTJDO0lBQzNDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO1FBQzFCLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUNwQixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM1QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLENBQUMsQ0FBQztJQUVGLHNCQUFzQjtJQUN0QixNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7UUFDdkIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FB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