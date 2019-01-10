/**
 * Facility numbers according to spec.
 */
export declare enum Facility {
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
    Local7 = 23
}
/**
 * Severity numbers according to spec.
 */
export declare enum SyslogSeverity {
    Emergency = 0,
    Alert = 1,
    Critical = 2,
    Error = 3,
    Warning = 4,
    Notice = 5,
    Informational = 6,
    Debug = 7
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
    tags?: {
        [key: string]: string;
    };
}
/**
 * Unifying minimal interface required of transport implementations.
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
}
/**
 * Construct a syslog row given the message.
 */
export declare const rfc5424Row: (msg: SyslogMessage) => string;
/**
 * A (tcp) client connected to a syslog host.
 */
export interface Client {
    /**
     * Check if client is connected.
     */
    isConnected(): boolean;
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
    /** Whether to connect with websocket. */
    useWebSocket: boolean;
    /** Whether to use TLS or not. */
    useTls: boolean;
    /** The number of milliseconds to allow a socket to idle before disconnecting. */
    timeout: number;
}
/**
 * Create a syslog client from the given options.
 */
export declare const createClient: (copts: ClientOpts) => Promise<Client>;
