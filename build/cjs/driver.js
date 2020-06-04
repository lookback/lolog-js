"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
/**
 * Facility numbers according to spec.
 */
var Facility;
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
})(Facility = exports.Facility || (exports.Facility = {}));
/**
 * Severity numbers according to spec.
 */
var SyslogSeverity;
(function (SyslogSeverity) {
    SyslogSeverity[SyslogSeverity["Emergency"] = 0] = "Emergency";
    SyslogSeverity[SyslogSeverity["Alert"] = 1] = "Alert";
    SyslogSeverity[SyslogSeverity["Critical"] = 2] = "Critical";
    SyslogSeverity[SyslogSeverity["Error"] = 3] = "Error";
    SyslogSeverity[SyslogSeverity["Warning"] = 4] = "Warning";
    SyslogSeverity[SyslogSeverity["Notice"] = 5] = "Notice";
    SyslogSeverity[SyslogSeverity["Informational"] = 6] = "Informational";
    SyslogSeverity[SyslogSeverity["Debug"] = 7] = "Debug";
})(SyslogSeverity = exports.SyslogSeverity || (exports.SyslogSeverity = {}));
/**
 * Construct a syslog row given the message.
 */
exports.rfc5424Row = (msg) => {
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
exports.createClient = (copts) => __awaiter(void 0, void 0, void 0, function* () {
    // tslint:disable-next-line: no-let
    let connectSocket;
    if (process.env.IS_BROWSER) {
        connectSocket = {};
    }
    else {
        const { connectSocket: c } = require('./socket');
        connectSocket = c;
    }
    const connect = copts.httpEndpoint ? http_1.connectHttp(copts.httpEndpoint) : connectSocket;
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
                conn.write(exports.rfc5424Row(msg), (e) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGlDQUFxQztBQUVyQzs7R0FFRztBQUNILElBQVksUUFjWDtBQWRELFdBQVksUUFBUTtJQUNoQiwyQ0FBVSxDQUFBO0lBQ1YsdUNBQVEsQ0FBQTtJQUNSLDJDQUFVLENBQUE7SUFDViwwQ0FBVSxDQUFBO0lBQ1YsMENBQVUsQ0FBQTtJQUNWLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0FBQ2YsQ0FBQyxFQWRXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBY25CO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGNBU1g7QUFURCxXQUFZLGNBQWM7SUFDdEIsNkRBQWEsQ0FBQTtJQUNiLHFEQUFTLENBQUE7SUFDVCwyREFBWSxDQUFBO0lBQ1oscURBQVMsQ0FBQTtJQUNULHlEQUFXLENBQUE7SUFDWCx1REFBVSxDQUFBO0lBQ1YscUVBQWlCLENBQUE7SUFDakIscURBQVMsQ0FBQTtBQUNiLENBQUMsRUFUVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQVN6QjtBQW1DRDs7R0FFRztBQUNVLFFBQUEsVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBVSxFQUFFO0lBQ3JELE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzlDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekQsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9B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