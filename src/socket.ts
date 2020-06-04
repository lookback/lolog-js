import { ClientOpts, Transport } from './driver';

/**
 * Create a (nodejs) TCP/TLS socket to send syslog messages over.
 */
export const connectSocket = (copts: ClientOpts): Promise<Transport> =>
    new Promise(async (rs, rj) => {
    const net = await import('net');
    const tls = await import('tls');
    const family = net.isIPv6(copts.host) ? 6 : 4;
    try {
        // options for all things
        const basic = {
            host: copts.host,
            port: copts.port,
            family,
        };

        // merged params
        const o = { ...basic };

        // connection via tls or not.
        const conn = copts.useTls ? tls.connect(o) : net.connect(o);

        // the non-tls socket events.
        conn.once('connect', () => rs(conn as Transport));
        conn.once('error', (e: any) => rj(e));

        // the tls events
        conn.once('secureConnection', () => rs(conn as Transport));
        conn.once('tlsClientError', (e: any) => rj(e));

    } catch (e) {
        rj(e);
    }
});
