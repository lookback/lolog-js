"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function isObjectObject(o) {
    return o !== null && typeof o === 'object'
        && Object.prototype.toString.call(o) === '[object Object]';
}
function isPlainObject(o) {
    if (isObjectObject(o) === false)
        return false;
    // If has modified constructor
    const ctor = o.constructor;
    if (typeof ctor !== 'function')
        return false;
    // If has modified prototype
    const prot = ctor.prototype;
    if (isObjectObject(prot) === false)
        return false;
    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }
    // Most likely a plain Object
    return true;
}
exports.isPlainObject = isPlainObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtcGxhaW4tb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2lzLXBsYWluLW9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztHQUtHO0FBQ0gsU0FBUyxjQUFjLENBQUMsQ0FBTTtJQUMxQixPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUTtXQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssaUJBQWlCLENBQUM7QUFDbkUsQ0FBQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxDQUFNO0lBRWhDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUs7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU5Qyw4QkFBOEI7SUFDOUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUMzQixJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVU7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU3Qyw0QkFBNEI7SUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUM1QixJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFakQseURBQXlEO0lBQ3pELElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsS0FBSyxLQUFLLEVBQUU7UUFDaEQsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFFRCw2QkFBNkI7SUFDN0IsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQW5CRCxzQ0FtQkMifQ==