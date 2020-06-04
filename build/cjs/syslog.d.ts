import { Options } from '.';
import { PreparedLog } from './prepare';
export interface LogResult {
    lastError?: Error;
    attempts: number;
}
export declare type LoggerImpl = (prep: PreparedLog) => Promise<LogResult>;
export declare const createSyslogger: (opts: Options) => LoggerImpl;