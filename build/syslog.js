"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_browser_1 = __importDefault(require("is-browser"));
const uuid_1 = __importDefault(require("uuid"));
const _1 = require(".");
const prepare_1 = require("./prepare");
const driver_1 = require("./driver");
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
        const httpEndpoint = is_browser_1.default ? '/log' : undefined;
        client = yield driver_1.createClient({
            host: opts.logHost,
            port: opts.logPort,
            httpEndpoint,
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
            msgId: !opts.disableUuid ? uuid_1.default.v4() : undefined,
            pid: opts.appVersion || process.pid,
            apiKeyId: opts.apiKeyId,
            apiKey: opts.apiKey,
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
        const logit = () => clientLog(syslogSeverity, opts.env, prep.appName, timestamp, logRow)
            .catch(e => {
            if (Date.now() - timestamp.getTime() > 60000) {
                console.warn("Failed to send to syslog server", logRow, e);
                return;
            }
            else {
                return wait(3000).then(logit);
            }
        });
        // log with retries
        logit();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsNERBQW1DO0FBQ25DLGdEQUF3QjtBQUN4Qix3QkFBd0M7QUFDeEMsdUNBQWtEO0FBQ2xELHFDQUtrQjtBQUVsQixNQUFNLElBQUksR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFJdEQsUUFBQSxlQUFlLEdBQUcsQ0FBQyxJQUFhLEVBQWMsRUFBRTtJQUN6RCx3RUFBd0U7SUFDeEUsZ0VBQWdFO0lBQ2hFLGtDQUFrQztJQUNsQyxJQUFJLE1BQU0sR0FBa0IsSUFBSSxDQUFDO0lBRWpDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFNLENBQUM7SUFFL0Msc0JBQXNCO0lBQ3RCLE1BQU0sYUFBYSxHQUFHLEdBQVMsRUFBRTtRQUM3QixNQUFNLFlBQVksR0FBRyxvQkFBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNwRCxNQUFNLEdBQUcsTUFBTSxxQkFBWSxDQUFDO1lBQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztZQUNsQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbEIsWUFBWTtZQUNaLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ3hCLE9BQU8sRUFBRSxXQUFXO1NBQ3ZCLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQSxDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsQ0FDZCxRQUF3QixFQUN4QixHQUFXLEVBQ1gsT0FBZSxFQUNmLFNBQWUsRUFDZixPQUFlLEVBQ0YsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxhQUFhLEVBQUUsQ0FBQztTQUN6QjtRQUNELE1BQU0sTUFBTyxDQUFDLElBQUksQ0FBQztZQUNmLFFBQVE7WUFDUixRQUFRO1lBQ1IsU0FBUztZQUNULE9BQU87WUFDUCxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDbkIsT0FBTztZQUNQLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGNBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUNoRCxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRztZQUNuQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLElBQUksRUFBRTtnQkFDRixHQUFHO2FBQ047U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUEsQ0FBQztJQUVGLE9BQU8sQ0FBQyxJQUFpQixFQUFFLEVBQUU7UUFDekIsdURBQXVEO1FBQ3ZELE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFckQsK0JBQStCO1FBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNO1lBQ3RCLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDbkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sS0FBSyxHQUFHLEdBQWlCLEVBQUUsQ0FBQyxTQUFTLENBQ3ZDLGNBQWMsRUFDZCxJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxPQUFPLEVBQ1osU0FBUyxFQUNULE1BQU0sQ0FDVDthQUNBLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNQLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFNLEVBQUU7Z0JBQzNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPO2FBQ1Y7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2xDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxtQkFBbUI7UUFDbkIsS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRixNQUFNLGNBQWMsR0FBRyxDQUFDLENBQWEsRUFBWSxFQUFFO0lBQy9DLFFBQVEsQ0FBQyxFQUFFO1FBQ1AsS0FBSyxhQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztRQUM3QyxLQUFLLGFBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLGlCQUFRLENBQUMsTUFBTSxDQUFDO1FBQzVDLEtBQUssYUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8saUJBQVEsQ0FBQyxNQUFNLENBQUM7S0FDaEQ7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLGNBQWMsR0FBRyxDQUFDLENBQVcsRUFBa0IsRUFBRTtJQUNuRCxRQUFRLENBQUMsRUFBRTtRQUNQLEtBQUssa0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLHVCQUFjLENBQUMsS0FBSyxDQUFDO1FBQ2pELEtBQUssa0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLHVCQUFjLENBQUMsS0FBSyxDQUFDO1FBQ2pELEtBQUssa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLHVCQUFjLENBQUMsYUFBYSxDQUFDO1FBQ3hELEtBQUssa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLHVCQUFjLENBQUMsT0FBTyxDQUFDO1FBQ2xELEtBQUssa0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLHVCQUFjLENBQUMsS0FBSyxDQUFDO0tBQ3BEO0FBQ0wsQ0FBQyxDQUFDIn0=