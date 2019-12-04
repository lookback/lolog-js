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
const socket_1 = require("./socket");
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
    const connect = copts.httpEndpoint ? http_1.connectHttp(copts.httpEndpoint) : socket_1.connectSocket;
    // tslint:disable-next-line:no-let
    let lastErr = undefined;
    const conn = yield connect(copts).catch(e => {
        lastErr = e;
        return null;
    });
    if (conn) {
        console.log('Syslog new socket connected.');
        const disconnect = (e) => {
            console.log(`Syslog socket disconnect: ${e.message}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGlDQUFxQztBQUNyQyxxQ0FBeUM7QUFFekM7O0dBRUc7QUFDSCxJQUFZLFFBY1g7QUFkRCxXQUFZLFFBQVE7SUFDaEIsMkNBQVUsQ0FBQTtJQUNWLHVDQUFRLENBQUE7SUFDUiwyQ0FBVSxDQUFBO0lBQ1YsMENBQVUsQ0FBQTtJQUNWLDBDQUFVLENBQUE7SUFDViw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtBQUNmLENBQUMsRUFkVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQWNuQjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxjQVNYO0FBVEQsV0FBWSxjQUFjO0lBQ3RCLDZEQUFhLENBQUE7SUFDYixxREFBUyxDQUFBO0lBQ1QsMkRBQVksQ0FBQTtJQUNaLHFEQUFTLENBQUE7SUFDVCx5REFBVyxDQUFBO0lBQ1gsdURBQVUsQ0FBQTtJQUNWLHFFQUFpQixDQUFBO0lBQ2pCLHFEQUFTLENBQUE7QUFDYixDQUFDLEVBVFcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFTekI7QUFtQ0Q7O0dBRUc7QUFDVSxRQUFBLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQVUsRUFBRTtJQUNyRCxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM5QyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3pELE1BQU0sT0FBTyxHQUFHLEdB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