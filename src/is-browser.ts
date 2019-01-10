// lets assume there is a window
declare const window: any;

// and a sneaky helper to get "this"
const __this = Function("return this");

/**
 * Check if this is a browser. `window` must be defined and be `this`.
 */
export const isBrowser = (): boolean => typeof window !== 'undefined' && __this() == window;
