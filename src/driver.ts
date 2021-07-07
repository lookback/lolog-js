import { connectHttp } from './http';
import { isBrowser } from './is-browser';

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
    apiKeyId?: string;
    apiKey?: string;
    tags?: { [key: string]: string };
    flush?: boolean; // HTTP only
    callback?: (err?: Error) => void;
}

/**
 * Unifying minimal interface required of transport implementations.
 *
 * NB. It's important all function signatures below folllow that of NodeJS Socket.
 * We can't introduce function signatures that differ between Http and Socket.
 */
export interface Transport {
    /** Make transport time out after ms idle. */
    setTimeout: (ms: number, cb: () => void) => void;
    /** Close the transport. */
    end: () => void;
    /** Add an event listener. */
    on: (n: string, cb: (e: Error | null, v?: any) => void) => void;
    /** Remove all registered event listeners. */
    removeAllListeners: () => void;
    /** Write the given string to the underlying transport. */
    write: (msg: string, cb: (e: Error | null) => void) => void;
    /** Flush the underlying transport, if possible.
     * Notably this does not exist for TCP sockets. */
    flush?: () => void;
}

/**
 * Construct a syslog row given the message.
 */
export const rfc5424Row = (msg: SyslogMessage): string => {
    const pri = msg.facility * 8 + msg.severity;
    const time = (msg.timestamp || new Date()).toISOString();
    const newline = msg.message[msg.message.length - 1] === '\n' ? '' : '\n';
    const struct = rfc5424Structured(msg);
    const pid = msg.pid ? String(msg.pid) : undefined;
    return (
        `<${pri}>1 ${time} ${nil(msg.hostname)} ${nil(msg.appName)} ` +
        `${nil(pid)} ${nil(msg.msgId)} ${nil(struct)} ${msg.message}${newline}`
    );
};

const RE_7BIT = /[\x00-\x7F]+/;
const is7bit = (s?: string) => !!s && !!RE_7BIT.exec(s);
const nil = (s?: string) => (is7bit(s) ? s : '-');
const escapeSdParam = (v: string) => v.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/]/g, '\\]');

// example log row:
// <134>1 2019-03-12T22:30:09.671872+00:00 dormammu.dev.lookback.io dormammu 4 -
// [chrome@53595 apiKey="secret" environment="development"]
// helloworld {"recordingID":"abc123", "test": "wow"}
// 53595 is an private enterprise number (PEN) for Lookback
// as assigned by IANA. https://www.iana.org/assignments/enterprise-numbers
// One can apply for our here: https://pen.iana.org/pen/PenApplication.page

const rfc5424Structured = (msg: SyslogMessage): string => {
    const sdElems = [];
    if (!!msg.apiKeyId && msg.apiKey) {
        sdElems.push(`${msg.apiKeyId}@53595`);
        sdElems.push(`apiKey="${msg.apiKey}"`);
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
    /**
     * Send message to the client. Rejects if the send fails.
     */
    send(msg: SyslogMessage): Promise<void>;
}

/**
 * Options for initializing a syslog client.
 */
export interface ClientOpts {
    /** Syslog hostname. */
    host: string;
    /** Syslog port. */
    port: number;
    /** Whether to connect with http post. */
    httpEndpoint?: string;
    /** Whether to use TLS or not. */
    useTls: boolean;
    /** The number of milliseconds to allow a socket to idle before disconnecting. */
    timeout: number;
}

/**
 * Create a syslog client from the given options.
 */
export const createClient = async (copts: ClientOpts): Promise<Client> => {
    let connectSocket: () => Promise<Transport>;
    if (isBrowser) {
        connectSocket = <any>{};
    } else {
        const { connectSocket: c } = require('./socket');
        connectSocket = c;
    }
    const connect = copts.httpEndpoint ? connectHttp(copts.httpEndpoint) : connectSocket;

    let lastErr: Error | undefined = undefined;
    const conn = await connect(copts).catch((e) => {
        lastErr = e;
        return null;
    });
    if (conn) {
        const disconnect = (e: Error) => {
            try {
                conn.end();
            } catch (e) {}
            if (lastErr) return; // already disconnected
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
        send: (msg: SyslogMessage): Promise<void> =>
            new Promise((rs, rj) => {
                try {
                    if (lastErr || !conn) {
                        return rj(new Error('Not connected'));
                    }
                    const row = rfc5424Row(msg);

                    const onWrite = (e: Error | null) => {
                        if (e) {
                            rj(e);
                        } else {
                            // If we are to follow up with a flush,
                            // do so on successful write.
                            if (!!msg.flush) {
                                conn.flush?.();
                            }

                            // This is guaranteed to not fail by virtue of prepareLog.
                            msg.callback!();

                            rs();
                        }
                    };

                    conn.write(row, onWrite);
                } catch (e) {
                    rj(e);
                }
            }),
    };
};
