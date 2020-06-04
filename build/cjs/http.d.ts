import { ClientOpts, Transport } from './driver';
/**
 * Create a websocket transport for syslog messages.
 */
export declare const connectHttp: (endpoint: string) => (copts: ClientOpts) => Promise<Transport>;
