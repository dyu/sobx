import S from 's-js';
import SArray from 's-array';
function throwCannotSet(p) {
    throw 'Cannot set';
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
    var g = function () { return s(); };
    var v;
    Object.defineProperty($, key, {
        enumerable: key !== '_',
        configurable: true,
        set: throwCannotSet,
        get: function () { return v !== undefined ? v : (v = S(g)); }
    });
}
function makeReactive(obj, key, val, $) {
    var pd;
    if (typeof val === 'function' || (pd = Object.getOwnPropertyDescriptor(obj, key)) && pd.configurable === false) {
        $[key] = val;
    }
    else if (Array.isArray(val)) {
        defArray(obj, key, SArray(val), $);
    }
    else if (typeof val === 'object') {
        observe(val, ($[key] = {}));
    }
    else {
        defScalar(obj, key, val, $);
    }
}
function observe(obj, $) {
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        makeReactive(obj, key, obj[key], $);
    }
    Object.defineProperty(obj, '$', {
        enumerable: false,
        writable: false,
        value: $
    });
    return obj;
}
/**
 * Make the object/pojo observable.
 */
export function observable(obj, $) {
    return observe(obj, $ || {});
}
/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export function bindTo(obj, fn) {
    return S(fn.bind(obj));
}
/**
 * Resolves the property value.
 */
export function prop(val, def) {
    if (typeof val === 'function')
        return val();
    if (!Array.isArray(val))
        return val === undefined ? def : val;
    switch (val.length) {
        case 1: return val[0];
        case 2: return val[0][val[1]];
        case 3: return val[0][val[1]] ? val[2] : def;
        case 4: return val[0][val[1]] ? val[2] : val[3];
        default: return def;
    }
}
//# sourceMappingURL=index.js.map