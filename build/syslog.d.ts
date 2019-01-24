import { Options } from '.';
import { PreparedLog } from './prepare';
export declare type LoggerImpl = (prep: PreparedLog) => void;
export declare const createSyslogger: (opts: Options) => LoggerImpl;
