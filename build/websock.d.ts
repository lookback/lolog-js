import { ClientOpts, Transport } from "./driver";
/**
 * Create a websocket transport for syslog messages.
 */
export declare const connectWebsocket: (copts: ClientOpts) => Promise<Transport>;
