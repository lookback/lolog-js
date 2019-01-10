import { Options } from ".";
import { PreparedLog } from "./prepare";
export declare const createSyslogger: (opts: Options) => (prep: PreparedLog) => void;
