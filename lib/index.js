import S from 's-js';
import { default as newSArray } from 's-array';
export { default as newSArray } from 's-array';
function returnThis() {
    return this;
}
function throwThis() {
    throw this;
}
function maybeProp(obj, key, value, yes) {
    yes && Object.defineProperty(obj, key, {
        enumerable: false,
        writable: false,
        value: value
    });
}
function defArray(obj, key, val, $) {
    var d;
    Object.defineProperty(obj, key, d = {
        enumerable: key !== '_',
        configurable: true,
        set: function (p) { return Array.isArray(p) ? val(p) : (p !== val && val(p())); },
        get: function () { return val; }
    });
    Object.defineProperty($, key, d);
}
function defScalar(obj, key, val, $) {
    var s = S.data(val);
    Object.defineProperty(obj, key, {
        enumerable: key !== '_',
        configurable: true,
        set: s,
        get: s
    });
    $ && Object.defineProperty($, key, {
        enumerable: key !== '_',
        configurable: true,
        set: throwThis.bind('Cannot set ' + key),
        get: returnThis.bind(s)
    });
}
function makeReactive(obj, key, val, $) {
    var pd;
    if (val === null || val === undefined) {
        defScalar(obj, key, val, $);
    }
    else if (typeof val === 'function' || (pd = Object.getOwnPropertyDescriptor(obj, key)) && pd.configurable === false) {
        if ($)
            $[key] = val;
    }
    else if (Array.isArray(val)) {
        $ && defArray(obj, key, newSArray(val), $);
    }
    else if (typeof val !== 'object') {
        defScalar(obj, key, val, $);
    }
    else if (key !== '_') {
        observable(val, $ && ($[key] = {}));
    }
    else {
        Object.defineProperty(obj, key, {
            enumerable: false,
            configurable: true,
            value: observable(val, $)
        });
    }
}
/**
 * Make the object/pojo observable.
 */
export function observable(obj, $) {
    if ($ && typeof $ !== 'object') {
        $ = undefined;
    }
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        makeReactive(obj, key, obj[key], $);
    }
    $ && Object.defineProperty(obj, '$', {
        enumerable: false,
        writable: false,
        value: $
    });
    return obj;
}
function freezeFn(obj, fn) {
    return function (arg) {
        return S.freeze(function () { return fn.call(obj, arg); });
    };
}
export function bindPrototypeTo(obj, pt, flags, freezeSuffix) {
    var f = flags || 0, overwrite = 0 !== (1 /* OVERWRITE */ & f), x;
    x = {};
    if ((2 /* OWN_KEYS */ & f)) {
        for (var _i = 0, _a = Object.keys(pt); _i < _a.length; _i++) {
            var key_1 = _a[_i];
            if (key_1 === 'constructor') {
                // ignore
            }
            else if (freezeSuffix && freezeSuffix === key_1.charAt(key_1.length - 1)) {
                maybeProp(obj, key_1, (x[key_1] = freezeFn(obj, pt[key_1])), overwrite);
            }
            else {
                maybeProp(obj, key_1, (x[key_1] = pt[key_1]['bind'](obj)), overwrite);
            }
        }
    }
    else {
        for (var key in pt) {
            if (key === 'constructor') {
                // ignore
            }
            else if (freezeSuffix && freezeSuffix === key.charAt(key.length - 1)) {
                maybeProp(obj, key, (x[key] = freezeFn(obj, pt[key])), overwrite);
            }
            else {
                maybeProp(obj, key, (x[key] = pt[key]['bind'](obj)), overwrite);
            }
        }
    }
    return x;
}
/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export function wrapAndBindTo(obj, fn) {
    return S(fn.bind(obj));
}
/**
 * Resolves the property value and returns the default if undefined.
 */
export function prop(val, def) {
    return typeof val === 'function' ? val() : (val === undefined ? def : val);
}
export function $$(obj, field) {
    if (field)
        obj = obj[field];
    return typeof obj === 'function' ? obj() : obj;
}
//# sourceMappingURL=index.js.map