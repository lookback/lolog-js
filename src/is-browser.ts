// lets assume there is a window
declare const window: any;

// and a sneaky helper to get "this"
const getThis = require('./is-browser-get-this');

/**
 * Check if this is a browser. `window` must be defined and be `this`.
 */
export const isBrowser = (): boolean => typeof window !== 'undefined' && getThis() == window;
