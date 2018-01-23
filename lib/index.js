import S from 's-js';
import SArray from 's-array';
function returnThis() {
    return this;
}
function throwThis() {
    throw this;
}
function defArray(obj, key, val, $) {
    var d;
    Object.defineProperty(obj, key, d = {
        enumerable: key !== '_',
        configurable: true,
        set: function (p) { return Array.isArray(p) ? val(p) : (p !== val && val(p())); },
        get: function () { return val; }
    });
    $ && Object.defineProperty($, key, d);
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
        defArray(obj, key, SArray(val), $);
    }
    else if (typeof val === 'object') {
        observable(val, $ && ($[key] = {}));
    }
    else {
        defScalar(obj, key, val, $);
    }
}
/**
 * Make the object/pojo observable.
 */
export function observable(obj, $) {
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
export function bindPrototypeTo(obj, pt) {
    var x;
    x = {};
    for (var _i = 0, _a = Object.keys(pt); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key === 'constructor') {
            // ignore
        }
        else if ('$' === key.charAt(key.length - 1)) {
            x[key] = freezeFn(obj, pt[key]);
        }
        else {
            Object.defineProperty(obj, key, {
                enumerable: false,
                writable: false,
                value: (x[key] = pt[key].bind(obj))
            });
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