"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// and a sneaky helper to get "this"
const getThis = require('./is-browser-get-this');
/**
 * Check if this is a browser. `window` must be defined and be `this`.
 */
exports.isBrowser = () => typeof window !== 'undefined' && getThis() == window;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pcy1icm93c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esb0NBQW9DO0FBQ3BDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRWpEOztHQUVHO0FBQ1UsUUFBQSxTQUFTLEdBQUcsR0FBWSxFQUFFLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sRUFBRSxJQUFJLE1BQU0sQ0FBQyJ9