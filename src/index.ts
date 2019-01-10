
/**
 * The overloaded variants of logging.
 */
type LogFunction = {
    /** Log just one message. */
    (message: string): void;
    /** Log a message and some well known, indexed fields. */
    (message: string, wellKnown: LogWellKnown): void;
    /** Log a message; some well known, indexed fields and some random json serializable data. */
    (message: string, wellKnown: LogWellKnown, data: LogData): void;
};

/**
 * Unindexed, JSON serializable data.
 */
export type LogData = { [key: string]: any };

/**
 * Fields we together have decided the name of and are indexed for searching.
 */
export interface LogWellKnown {
    recordingId?: string;
    userId?: string;
    // some process to add more
}

// keep in sync with interface definition
const WellKnown: { [k: string]: boolean } = {
    recordingId: true,
    userId: true,
};

/**
 * Check if the given argument is a `LogWellKnown`. Every single field must be well known.
 */
export const isWellKnown = (t: any): t is LogWellKnown => {
    if (!!t) return false;
    for (const f in Object.keys(t)) {
        if (!WellKnown[f]) return false;
    }
    return true;
};

/**
 * Logging instance.
 */
export interface Logger {
    /**
     * Trace is the lowest level possible. It is things like direct raw dump on HTTP protocol
     * level etc. It's not possible to forward this level to the ingester.
     * It is only for local development.
     */
    trace: LogFunction;

    /**
     * Debug is a low level that, when needed for debugging reasons and limited time periods,
     * can be forwarded to the log ingester. It is allowed to be more verbose and detailed.
     * The audience is mainly the developer of the service
     */
    debug: LogFunction;

    /**
     * Info is the default run level that is forwarded to our log ingester. It is a message
     * that mostly make sense for the developer of the service. It is fine to use this for
     * higher level room events in dormammu, or stripe callback events.
     */
    info: LogFunction;

    /**
     * Warn is a problem that the application can recover from itself, but needs to be
     * seen by someone during office hours. The message must be such that anyone, not just
     * the developer can understand the problem.
     */
    warn: LogFunction;

    /**
     * Error is a serious problem that must be dealt with right away. Wake up whoever is on
     * duty in the middle of the night kind of seriousness. The message must be such that
     * anyone, not just the developer can understand the problem.
     */
    error: LogFunction;
}
