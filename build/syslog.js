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
const RETRY_CUTOFF = 60000;
const RETRY_WAIT = 3000;
exports.createSyslogger = (opts) => {
    // Holds the client when it is connected. When we detect a disconnect or
    // error, we remove the instance and reconnect on next log line.
    // tslint:disable-next-line:no-let
    let client = null;
    const facility = selectFacility(opts.compliance);
    const idleTimeout = opts.idleTimeout || 10000;
    // connect the client.
    const connectClient = (timestamp) => __awaiter(this, void 0, void 0, function* () {
        const httpEndpoint = is_browser_1.default ? '/log' : undefined;
        const doCreate = () => driver_1.createClient({
            host: opts.logHost,
            port: opts.logPort,
            httpEndpoint,
            useTls: !opts.disableTls,
            timeout: idleTimeout,
        });
        client = yield doCreate()
            .catch(e => {
            if (Date.now() - timestamp.getTime() > RETRY_CUTOFF) {
                throw e;
            }
            else {
                return wait(RETRY_WAIT).then(doCreate);
            }
        });
    });
    const clientLog = (severity, env, appName, timestamp, message) => __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-let
        let connectErr = null;
        if (!client || !client.isConnected()) {
            yield connectClient(timestamp).catch(e => {
                connectErr = e;
            });
        }
        if (connectErr != null) {
            throw connectErr;
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
            if (Date.now() - timestamp.getTime() > RETRY_CUTOFF) {
                console.warn("Failed to send to syslog server", logRow, e);
                return;
            }
            else {
                return wait(RETRY_WAIT).then(logit);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N5c2xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsNERBQW1DO0FBQ25DLGdEQUF3QjtBQUN4Qix3QkFBd0M7QUFDeEMsdUNBQWtEO0FBQ2xELHFDQUtrQjtBQUVsQixNQUFNLElBQUksR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFJbkUsTUFBTSxZQUFZLEdBQUcsS0FBTSxDQUFDO0FBQzVCLE1BQU0sVUFBVSxHQUFHLElBQUssQ0FBQztBQUVaLFFBQUEsZUFBZSxHQUFHLENBQUMsSUFBYSxFQUFjLEVBQUU7SUFDekQsd0VBQXdFO0lBQ3hFLGdFQUFnRTtJQUNoRSxrQ0FBa0M7SUFDbEMsSUFBSSxNQUFNLEdBQWtCLElBQUksQ0FBQztJQUVqQyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksS0FBTSxDQUFDO0lBRS9DLHNCQUFzQjtJQUN0QixNQUFNLGFBQWEsR0FBRyxDQUFPLFNBQWUsRUFBRSxFQUFFO1FBQzVDLE1BQU0sWUFBWSxHQUFHLG9CQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3BELE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDLHFCQUFZLENBQUM7WUFDaEMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ2xCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztZQUNsQixZQUFZO1lBQ1osTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFDeEIsT0FBTyxFQUFFLFdBQVc7U0FDdkIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLE1BQU0sUUFBUSxFQUFFO2FBQ3hCLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNQLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLEVBQUU7Z0JBQ2pELE1BQU0sQ0FBQyxDQUFDO2FBQ1g7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUEsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFHLENBQ2QsUUFBd0IsRUFDeEIsR0FBVyxFQUNYLE9BQWUsRUFDZixTQUFlLEVBQ2YsT0FBZSxFQUNGLEVBQUU7UUFDZixrQ0FBa0M7UUFDbEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbEMsTUFBTSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNyQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFDRCxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUU7WUFDcEIsTUFBTSxVQUFVLENBQUM7U0FDcEI7UUFDRCxNQUFNLE1BQU8sQ0FBQyxJQUFJLENBQUM7WUFDZixRQUFRO1lBQ1IsUUFBUTtZQUNSLFNBQVM7WUFDVCxPQUFPO1lBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ25CLE9BQU87WUFDUCxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxjQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDaEQsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLEdBQUc7WUFDbkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixJQUFJLEVBQUU7Z0JBQ0YsR0FBRzthQUNOO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBLENBQUM7SUFFRixPQUFPLENBQUMsSUFBaUIsRUFBRSxFQUFFO1FBQ3pCLHVEQUF1RDtRQUN2RCxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJELCtCQUErQjtRQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtZQUN0QixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xELENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUzQyxNQUFNLEtBQUssR0FBRyxHQUFpQixFQUFFLENBQUMsU0FBUyxDQUN2QyxjQUFjLEVBQ2QsSUFBSSxDQUFDLEdBQUcsRUFDUixJQUFJLENBQUMsT0FBTyxFQUNaLFNBQVMsRUFDVCxNQUFNLENBQ1Q7YUFDQSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDUCxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsWUFBWSxFQUFFO2dCQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0QsT0FBTzthQUNWO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN2QztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsbUJBQW1CO1FBQ25CLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFhLEVBQVksRUFBRTtJQUMvQyxRQUFRLENBQUMsRUFBRTtRQUNQLEtBQUssYUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8saUJBQVEsQ0FBQyxNQUFNLENBQUM7UUFDN0MsS0FBSyxhQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxpQkFBUSxDQUFDLE1BQU0sQ0FBQztRQUM1QyxLQUFLLGFBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLGlCQUFRLENBQUMsTUFBTSxDQUFDO0tBQ2hEO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFXLEVBQWtCLEVBQUU7SUFDbkQsUUFBUSxDQUFDLEVBQUU7UUFDUCxLQUFLLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLEtBQUssQ0FBQztRQUNqRCxLQUFLLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLEtBQUssQ0FBQztRQUNqRCxLQUFLLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLGFBQWEsQ0FBQztRQUN4RCxLQUFLLGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLE9BQU8sQ0FBQztRQUNsRCxLQUFLLGtCQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyx1QkFBYyxDQUFDLEtBQUssQ0FBQztLQUNwRDtBQUNMLENBQUMsQ0FBQyJ9