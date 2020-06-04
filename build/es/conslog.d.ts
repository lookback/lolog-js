import { LoggerImpl } from './syslog';
export interface Output {
    debug(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}
export declare const createConsLogger: (output: Output) => LoggerImpl;
