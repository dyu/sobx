import S from 's-js';
import SArray from 's-array';
function makeReactive(obj, key, val) {
    if (Array.isArray(val)) {
        obj[key] = SArray(val);
        return;
    }
    else if (typeof val === 'function') {
        return;
    }
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }
    if (typeof val === 'object') {
        observable(val);
        return;
    }
    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    var s = S.data(val);
    Object.defineProperty(obj, key, {
        enumerable: key !== '_',
        configurable: true,
        //get: () => isArray ? s : s(),
        get: s,
        set: s
    });
}
/**
 * Make the object observable.
 */
export function observable(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        makeReactive(obj, keys[i], obj[keys[i]]);
    }
    return obj;
}
/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export function bindTo(obj, fn) {
    return S(fn.bind(obj));
}
/**
 * Ignore this.
 */
export function prop(array, def) {
    if (!Array.isArray(array))
        return array === undefined ? def : array;
    switch (array.length) {
        case 1: return array[0];
        case 2: return array[0][array[1]];
        case 3: return array[0][array[1]] ? array[2] : def;
        case 4: return array[0][array[1]] ? array[2] : array[3];
        default: return def;
    }
}
//# sourceMappingURL=index.js.map