import { mkValidator } from './validator';
import { WellKnown } from '.';

// keep in sync with interface definition
const WellKnown: { [k: string]: 'string' | 'number' | 'boolean' } = {
    timestamp: 'number',
    appName: 'string',
    recordingId: 'string',
    userId: 'string',
    teamId: 'string',
    userIp: 'string',
    sessionId: 'string',
    metricGroup: 'string',
    disableConsole: 'boolean',
};

/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
export const isWellKnown: (t: any, reject?: (msg: string) => void) => t is WellKnown = mkValidator(WellKnown);
