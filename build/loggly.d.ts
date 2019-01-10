import { Options } from ".";
import { LoggerImpl } from "./syslog";
export interface LogglyTracker {
    push: {
        (message: string): void;
        (message: string, json: {
            [key: string]: any;
        }): void;
    };
}
/**
 * Create a loggly loggler from options.
 */
export declare const createLogglyLogger: (opts: Options) => LoggerImpl;
