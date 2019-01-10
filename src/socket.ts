import { ClientOpts, Transport } from "./driver";

/**
 * Create a (nodejs) TCP/TLS socket to send syslog messages over.
 */
export const connectSocket = (copts: ClientOpts): Promise<Transport> => new Promise((rs, rj) => {
    const net = require('net');
    const tls = require('tls');
    const family = net.isIPv6(copts.host) ? 6 : 4;
    try {
        const o = {
            host: copts.host,
            port: copts.port,
            family,
        };
        if (copts.useTls) {
            const conn = tls.connect(o, () => rs(conn));
        } else {
            const conn = net.createConnection(o, () => rs(conn));
        }
    } catch (e) {
        rj(e);
    }
});
