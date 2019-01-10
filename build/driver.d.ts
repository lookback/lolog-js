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
 * Construct a syslog row given the message.
 */
export declare const rfc5424Row: (msg: SyslogMessage) => string;
/**
 * A (tcp) client connected to a syslog host.
 */
export interface Client {
    isConnected(): boolean;
    send(msg: SyslogMessage): Promise<void>;
}
export declare const createClient: (host: string, port: number, timeout: number, useWebSocket: boolean) => Promise<Client>;
