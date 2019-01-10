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
const net = require("net");
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
exports.createClient = (host, port, timeout) => __awaiter(this, void 0, void 0, function* () {
    const conn = yield connect(host, port).catch(e => {
        lastErr = e;
        return null;
    });
    // tslint:disable-next-line:no-let
    let lastErr = undefined;
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
        conn.setTimeout(timeout, () => {
            disconnect(new Error('socket timeout'));
        });
        conn.on('error', (e) => {
            disconnect(e);
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
                    return rj(new Error("Not connected"));
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
const connect = (host, port) => new Promise((rs, rj) => {
    const family = net.isIPv6(host) ? 6 : 4;
    try {
        const conn = net.createConnection({ host, port, family }, () => rs(conn));
    }
    catch (e) {
        rj(e);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RyaXZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsMkJBQTJCO0FBRTNCOztHQUVHO0FBQ0gsSUFBWSxRQWNYO0FBZEQsV0FBWSxRQUFRO0lBQ2hCLDJDQUFVLENBQUE7SUFDVix1Q0FBUSxDQUFBO0lBQ1IsMkNBQVUsQ0FBQTtJQUNWLDBDQUFVLENBQUE7SUFDViwwQ0FBVSxDQUFBO0lBQ1YsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7SUFDWCw0Q0FBVyxDQUFBO0lBQ1gsNENBQVcsQ0FBQTtJQUNYLDRDQUFXLENBQUE7QUFDZixDQUFDLEVBZFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFjbkI7QUFFRDs7R0FFRztBQUNILElBQVksY0FTWDtBQVRELFdBQVksY0FBYztJQUN0Qiw2REFBYSxDQUFBO0lBQ2IscURBQVMsQ0FBQTtJQUNULDJEQUFZLENBQUE7SUFDWixxREFBUyxDQUFBO0lBQ1QseURBQVcsQ0FBQTtJQUNYLHVEQUFVLENBQUE7SUFDVixxRUFBaUIsQ0FBQTtJQUNqQixxREFBUyxDQUFBO0FBQ2IsQ0FBQyxFQVRXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBU3pCO0FBa0JEOztHQUVHO0FBQ1UsUUFBQSxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFVLEVBQUU7SUFDckQsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6RCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxD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