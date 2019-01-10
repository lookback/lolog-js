"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const prepare_1 = require("./prepare");
const driver_1 = require("./driver");
const is_browser_1 = require("./is-browser");
const wait = (ms) => new Promise(rs => setTimeout(rs, ms));
exports.createSyslogger = (opts) => {
    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client = null;
    const facility = selectFacility(opts.compliance);
    const idleTimeout = opts.idleTimeout || 10000;
    // connect the client.
    const connectClient = () => __awaiter(this, void 0, void 0, function* () {
        const useWebSocket = is_browser_1.isBrowser();
        client = yield driver_1.createClient({
            host: opts.logHost,
            port: opts.logPort,
            useWebSocket,
            useTls: !opts.disableTls,
            timeout: idleTimeout,
        });
    });
    const clientLog = (severity, env, appName, timestamp, message) => __awaiter(this, void 0, void 0, function* () {
        if (!client || !client.isConnected()) {
            yield connectClient();
        }
        yield client.send({
            facility,
            severity,
            timestamp,
            message,
            hostname: opts.host,
            appName,
            pid: process.pid,
            logglyKey: opts.apiKey,
            tags: {
                env,
            },
        });
    });
    return (prep) => {
        // the severity will be mapped to some syslog severity.
        const syslogSeverity = selectSeverity(prep.severity);
        // the row with the data to log
        const logRow = prep.merged
            ? `${prep.message} ${JSON.stringify(prep.merged)}`
            : prep.message;
        const timestamp = new Date(prep.timestamp);
        const logit = () => clientLog(syslogSeverity, opts.env, prep.appName, timestamp, logRow);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0JBQXdDO0FBQ3hDLHVDQUFrRDtBQUNsRCxxQ0FBMEU7QUFDMUUsNkNBQXlDO0FBRXpDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUl0RCxRQUFBLGVBQWUsR0FBRyxDQUFDLElBQWEsRUFBYyxFQUFFO0lBQ3pELHdFQUF3RTtJQUN4RSxnRUFBZ0U7SUFDaEUsa0NBQWtDO0lBQ2xDLElBQUksTUFBTSxHQUFrQixJQUFJLENBQUM7SUFFakMsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQU0sQ0FBQztJQUUvQyxzQkFBc0I7SUFDdEIsTUFBTSxhQUFhLEdBQUcsR0FBUyxFQUFFO1FBQzdCLE1BQU0sWUFBWSxHQUFHLHNCQUFTLEVBQUUsQ0FBQztRQUNqQyxNQUFNLEdBQUcsTUFBTSxxQkFBWSxDQUFDO1lBQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztZQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbEIsWUFBWTtZQUNaLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ3hCLE9BQU8sRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQSxDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsQ0FDZCxRQUF3QixFQUN4QixHQUFXLEVBQ1gsT0FBZSxFQUNmLFNBQWUsRUFDZixPQUFlLEVBQ0YsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxhQUFhLEVBQUUsQ0FBQztTQUN6QjtRQUNELE1BQU0sTUFBTyxDQUFDLElBQUksQ0FBQztZQUNmLFFBQVE7WUFDUixRQUFRO1lBQ1IsU0FBUztZQUNULE9BQU87WUFDUCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDbkIsT0FBTztZQUNQLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRztZQUNoQixTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDdEIsSUFBSSxFQUFFO2dCQUNGLEdBQUc7YUFDTjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQSxDQUFDO0lBRUYsT0FBTyxDQUFDLElBQWlCLEVBQUUsRUFBRTtRQUN6Qix1REFBdUQ7UUFDdkQsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyRCwrQkFBK0I7UUFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDdEIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsRCxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNuQixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFM0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUN6QixjQUFjLEVBQ2QsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsT0FBTyxFQUNaLFNBQVMsRUFDVCxNQUFNLENBQ1QsQ0FBQztRQUVGLG1CQUFtQjtRQUNuQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZCxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBTSxFQUFFO2dCQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0QsT0FBTzthQUNWO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLElBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFhLEVBQVksRUFBRTtJQUMvQyxRQUFRLENBQUMsRUFBRTtRQUNQLEtBQUssYUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8saUJBQVEsQ0FBQyxNQUFNLENBQUM7UUFDN0MsS0FBSyxhQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztRQUM1QyxLQUFLLGFBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLGlCQUFRLENBQUMsTUFBTSxDQUFDO0tBQ2hEO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFXLEVBQWtCLEVBQUU7SUFDbkQsUUFBUSxDQUFDLEVBQUU7UUFDUCxLQUFLLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLEtBQUssQ0FBQztRQUNqRCxLQUFLLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLEtBQUssQ0FBQztRQUNqRCxLQUFLLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLGFBQWEsQ0FBQztRQUN4RCxLQUFLLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLE9BQU8sQ0FBQztRQUNsRCxLQUFLLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLEtBQUssQ0FBQztLQUNwRDtBQUNMLENBQUMsQ0FBQyJ9