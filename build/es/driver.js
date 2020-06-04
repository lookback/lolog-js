var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connectHttp } from './http';
/**
 * Facility numbers according to spec.
 */
export var Facility;
(function (Facility) {
    Facility[Facility["Kernel"] = 0] = "Kernel";
    Facility[Facility["User"] = 1] = "User";
    Facility[Facility["System"] = 3] = "System";
    Facility[Facility["Audit"] = 13] = "Audit";
    Facility[Facility["Alert"] = 14] = "Alert";
    Facility[Facility["Local0"] = 16] = "Local0";
    Facility[Facility["Local1"] = 17] = "Local1";
    Facility[Facility["Local2"] = 18] = "Local2";
    Facility[Facility["Local3"] = 19] = "Local3";
    Facility[Facility["Local4"] = 20] = "Local4";
    Facility[Facility["Local5"] = 21] = "Local5";
    Facility[Facility["Local6"] = 22] = "Local6";
    Facility[Facility["Local7"] = 23] = "Local7";
})(Facility || (Facility = {}));
/**
 * Severity numbers according to spec.
 */
export var SyslogSeverity;
(function (SyslogSeverity) {
    SyslogSeverity[SyslogSeverity["Emergency"] = 0] = "Emergency";
    SyslogSeverity[SyslogSeverity["Alert"] = 1] = "Alert";
    SyslogSeverity[SyslogSeverity["Critical"] = 2] = "Critical";
    SyslogSeverity[SyslogSeverity["Error"] = 3] = "Error";
    SyslogSeverity[SyslogSeverity["Warning"] = 4] = "Warning";
    SyslogSeverity[SyslogSeverity["Notice"] = 5] = "Notice";
    SyslogSeverity[SyslogSeverity["Informational"] = 6] = "Informational";
    SyslogSeverity[SyslogSeverity["Debug"] = 7] = "Debug";
})(SyslogSeverity || (SyslogSeverity = {}));
/**
 * Construct a syslog row given the message.
 */
export const rfc5424Row = (msg) => {
    const pri = (msg.facility * 8) + msg.severity;
    const time = (msg.timestamp || new Date()).toISOString();
    const newline = msg.message[msg.message.length - 1] === "\n" ? "" : "\n";
    const struct = rfc5424Structured(msg);
    const pid = msg.pid ? String(msg.pid) : undefined;
    return `<${pri}>1 ${time} ${nil(msg.hostname)} ${nil(msg.appName)} ` +
        `${nil(pid)} ${nil(msg.msgId)} ${nil(struct)} ${msg.message}${newline}`;
};
const RE_7BIT = /[\x00-\x7F]+/;
const is7bit = (s) => !!s && !!RE_7BIT.exec(s);
const nil = (s) => is7bit(s) ? s : '-';
const escapeSdParam = (v) => v.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/]/g, '\\]');
// example log row:
// <134>1 2019-03-12T22:30:09.671872+00:00 dormammu.dev.lookback.io dormammu 4 -
// [chrome@53595 apiKey="secret" environment="development"]
// helloworld {"recordingID":"abc123", "test": "wow"}
// 53595 is an private enterprise number (PEN) for Lookback
// as assigned by IANA. https://www.iana.org/assignments/enterprise-numbers
// One can apply for our here: https://pen.iana.org/pen/PenApplication.page
const rfc5424Structured = (msg) => {
    const sdElems = [];
    if (!!msg.apiKeyId && msg.apiKey) {
        sdElems.push(`${msg.apiKeyId}@53595`);
        sdElems.push(`apiKey="${msg.apiKey}"`);
    }
    const sd = msg.tags || {};
    for (const sdId of Object.keys(sd)) {
        if (!is7bit(sdId))
            continue;
        const value = sd[sdId];
        sdElems.push(`${sdId}="${escapeSdParam(value)}"`);
    }
    return sdElems.length ? `[${sdElems.join(' ')}]` : '';
};
/**
 * Create a syslog client from the given options.
 */
export const createClient = (copts) => __awaiter(void 0, void 0, void 0, function* () {
    // tslint:disable-next-line: no-let
    let connectSocket;
    if (process.env.IS_BROWSER) {
        connectSocket = {};
    }
    else {
        const { connectSocket: c } = require('./socket');
        connectSocket = c;
    }
    const connect = copts.httpEndpoint ? connectHttp(copts.httpEndpoint) : connectSocket;
    // tslint:disable-next-line:no-let
    let lastErr = undefined;
    const conn = yield connect(copts).catch(e => {
        lastErr = e;
        return null;
    });
    if (conn) {
        const disconnect = (e) => {
            try {
                conn.end();
            }
            catch (e) {
            }
            if (lastErr)
                return; // already disconnected
            lastErr = e;
        };
        conn.setTimeout(copts.timeout, () => {
            disconnect(new Error('socket timeout'));
        });
        conn.on('error', (e) => {
            disconnect(e || new Error('Unknown error'));
        });
        conn.on('close', () => {
            disconnect(new Error('socket closed'));
        });
    }
    return {
        send: (msg) => new Promise((rs, rj) => {
            try {
                if (lastErr || !conn) {
                    return rj(new Error('Not connected'));
                }
                conn.write(rfc5424Row(msg), (e) => {
                    if (e) {
                        rj(e);
                    }
                    else {
                        rs();
                    }
                });
            }
            catch (e) {
                rj(e);
            }
        }),
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRXJDOztHQUVHO0FBQ0gsTUFBTSxDQUFOLElBQVksUUFjWDtBQWRELFdBQVksUUFBUTtJQUNoQiwyQ0FBVSxDQUFBO0lBQ1YsdUNBQVEsQ0FBQTtJQUNSLDJDQUFVLENBQUE7SUFDViwwQ0FBVSxDQUFBO0lBQ1YsMENBQVUsQ0FBQTtJQUNWLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0FBQ2YsQ0FBQyxFQWRXLFFBQVEsS0FBUixRQUFRLFFBY25CO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLENBQU4sSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3RCLDZEQUFhLENBQUE7SUFDYixxREFBUyxDQUFBO0lBQ1QsMkRBQVksQ0FBQTtJQUNaLHFEQUFTLENBQUE7SUFDVCx5REFBVyxDQUFBO0lBQ1gsdURBQVUsQ0FBQTtJQUNWLHFFQUFpQixDQUFBO0lBQ2pCLHFEQUFTLENBQUE7QUFDYixDQUFDLEVBVFcsY0FBYyxLQUFkLGNBQWMsUUFTekI7QUFtQ0Q7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFVLEVBQUU7SUFDckQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJ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