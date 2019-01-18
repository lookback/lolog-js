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
const socket_1 = require("./socket");
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
const rfc5424Structured = (msg) => {
    const sdElems = [];
    if (msg.logglyKey) {
        // 41058 is an private enterprise number (PEN) for Loggly
        // as assigned by IANA. https://www.iana.org/assignments/enterprise-numbers
        // we can apply for our own here:
        // https://pen.iana.org/pen/PenApplication.page
        sdElems.push(`${msg.logglyKey}@41058`);
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
exports.createClient = (copts) => __awaiter(this, void 0, void 0, function* () {
    const connect = copts.httpEndpoint ? http_1.connectHttp(copts.httpEndpoint) : socket_1.connectSocket;
    // tslint:disable-next-line:no-let
    let lastErr = undefined;
    const conn = yield connect(copts).catch(e => {
        lastErr = e;
        return null;
    });
    if (conn) {
        const disconnect = (e) => {
            if (lastErr)
                return; // already disconnected
            lastErr = e;
            conn.removeAllListeners();
            try {
                conn.end();
            }
            catch (e) {
            }
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
        isConnected: () => !lastErr,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUNBQXlDO0FBQ3pDLGlDQUFxQztBQUVyQzs7R0FFRztBQUNILElBQVksUUFjWDtBQWRELFdBQVksUUFBUTtJQUNoQiwyQ0FBVSxDQUFBO0lBQ1YsdUNBQVEsQ0FBQTtJQUNSLDJDQUFVLENBQUE7SUFDViwwQ0FBVSxDQUFBO0lBQ1YsMENBQVUsQ0FBQTtJQUNWLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0FBQ2YsQ0FBQyxFQWRXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBY25CO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGNBU1g7QUFURCxXQUFZLGNBQWM7SUFDdEIsNkRBQWEsQ0FBQTtJQUNiLHFEQUFTLENBQUE7SUFDVCwyREFBWSxDQUFBO0lBQ1oscURBQVMsQ0FBQTtJQUNULHlEQUFXLENBQUE7SUFDWCx1REFBVSxDQUFBO0lBQ1YscUVBQWlCLENBQUE7SUFDakIscURBQVMsQ0FBQTtBQUNiLENBQUMsRUFUVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQVN6QjtBQWtDRDs7R0FFRztBQUNVLFFBQUEsVUFBVSxHQUFHLENBQUMsR0FBa0IsRUFBVSxFQUFFO0lBQ3JELE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0lBQzlDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekQsTUFBTSxPQUFPLEdBQUcsR0FB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