import * as net from 'net';

/**
 * Facility numbers according to spec.
 */
export enum Facility {
    Kernel = 0,
    User = 1,
    System = 3,
    Audit = 13,
    Alert = 14,
    Local0 = 16,
    Local1 = 17,
    Local2 = 18,
    Local3 = 19,
    Local4 = 20,
    Local5 = 21,
    Local6 = 22,
    Local7 = 23,
}

/**
 * Severity numbers according to spec.
 */
export enum SyslogSeverity {
    Emergency = 0,
    Alert = 1,
    Critical = 2,
    Error = 3,
    Warning = 4,
    Notice = 5,
    Informational = 6,
    Debug = 7,
}

/**
 * A message.
 */
export interface SyslogMessage {
    facility: Facility;
    severity: SyslogSeverity;
    message: string;
    hostname?: string;
    timestamp?: Date;
    msgId?: string;
    appName?: string;
    pid?: string | number;
    logglyKey?: string;
    tags?: { [key: string]: string };
}

/**
 * Construct a syslog row given the message.
 */
export const rfc5424Row = (msg: SyslogMessage): string => {
    const pri = (msg.facility * 8) + msg.severity;
    const time = (msg.timestamp || new Date()).toISOString();
    const newline = msg.message[msg.message.length - 1] === "\n" ? "" : "\n";
    const struct = rfc5424Structured(msg);
    const pid = msg.pid ? String(msg.pid) : undefined;
    return `<${pri}>1 ${time} ${nil(msg.hostname)} ${nil(msg.appName)} ` +
        `${nil(pid)} ${nil(msg.msgId)} ${nil(struct)} ${msg.message}${newline}`;
};

const RE_7BIT = /[\x00-\x7F]+/;
const is7bit = (s?: string) => !!s && !!RE_7BIT.exec(s);
const nil = (s?: string) => is7bit(s) ? s : '-';
const escapeSdParam = (v: string) =>
    v.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/]/g, '\\]');

const rfc5424Structured = (msg: SyslogMessage): string => {
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
        if (!is7bit(sdId)) continue;
        const value = sd[sdId];
        sdElems.push(`${sdId}="${escapeSdParam(value)}"`);
    }
    return sdElems.length ? `[${sdElems.join(' ')}]` : '';
};

/**
 * A (tcp) client connected to a syslog host.
 */
export interface Client {
    isConnected(): boolean;
    send(msg: SyslogMessage): Promise<void>;
}

export const createClient = async (
    host: string,
    port: number,
    timeout: number
): Promise<Client> => {
    const conn = await connect(host, port).catch(e => {
        lastErr = e;
        return null;
    });
    // tslint:disable-next-line:no-let
    let lastErr: Error | undefined = undefined;
    if (conn) {
        const disconnect = (e: Error) => {
            if (lastErr) return; // already disconnected
            lastErr = e;
            conn.removeAllListeners();
            try {
                conn.end();
            } catch (e) {
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
        send: (msg: SyslogMessage): Promise<void> => new Promise((rs, rj) => {
            try {
                if (lastErr || !conn) {
                    return rj(new Error("Not connected"));
                }
                conn.write(rfc5424Row(msg), (e?: Error) => {
                    if (e) {
                        rj(e);
                    } else {
                        rs();
                    }
                });
            } catch (e) {
                rj(e);
            }
        }),
    };
};

const connect = (host: string, port: number): Promise<net.Socket> => new Promise((rs, rj) => {
    const family = net.isIPv6(host) ? 6 : 4;
    try {
        const conn = net.createConnection({ host, port, family }, () => rs(conn));
    } catch (e) {
        rj(e);
    }
});
