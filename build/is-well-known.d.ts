import { WellKnown } from ".";
declare const WellKnown: {
    [k: string]: 'string' | 'number' | 'boolean';
};
/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
export declare const isWellKnown: (t: any, reject?: (msg: string) => void) => t is WellKnown;
export {};
