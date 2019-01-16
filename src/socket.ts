import { ClientOpts, Transport } from "./driver";

/**
 * Create a (nodejs) TCP/TLS socket to send syslog messages over.
 */
export const connectSocket = (copts: ClientOpts): Promise<Transport> => new Promise((rs, rj) => {
    const net = require('net');
    const tls = require('tls');
    const family = net.isIPv6(copts.host) ? 6 : 4;
    try {
        const isLogglySSl = copts.host === 'logs-01.loggly.com' && copts.port == 6514;

        // options for all things
        const basic = {
            host: copts.host,
            port: copts.port,
            family,
        };

        // add certificate for loggly (it's self signed)
        const extra = isLogglySSl ? {
            rejectUnauthorized: false,
        } : {};

        // merged params
        const o = { ...basic, ...extra };
        if (copts.useTls) {
            const conn = tls.connect(o, () => rs(conn));
        } else {
            const conn = net.createConnection(o, () => rs(conn));
        }
    } catch (e) {
        rj(e);
    }
});
