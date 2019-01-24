import { ClientOpts, Transport } from './driver';
/**
 * Create a (nodejs) TCP/TLS socket to send syslog messages over.
 */
export declare const connectSocket: (copts: ClientOpts) => Promise<Transport>;
