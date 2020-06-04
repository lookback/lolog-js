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
export function isPlainObject(o) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXMtcGxhaW4tb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2lzLXBsYWluLW9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUNILFNBQVMsY0FBYyxDQUFDLENBQU07SUFDMUIsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVE7V0FDbkMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLGlCQUFpQixDQUFDO0FBQ25FLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLENBQU07SUFFaEMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRTlDLDhCQUE4QjtJQUM5QixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQzNCLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRTdDLDRCQUE0QjtJQUM1QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzVCLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUs7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUVqRCx5REFBeUQ7SUFDekQsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEtBQUssRUFBRTtRQUNoRCxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUVELDZCQUE2QjtJQUM3QixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIn0=