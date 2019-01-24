import { LoggerImpl } from './syslog';
import { Options } from '.';
export interface LogglyTracker {
    push: {
        (message: string): void;
        (data: {
            [key: string]: any;
        }): void;
    };
}
/**
 * Create a loggly loggler from options.
 */
export declare const createLogglyLogger: (opts: Options) => LoggerImpl;
