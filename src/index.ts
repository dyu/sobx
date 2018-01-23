import S from 's-js'
import SArray from 's-array'

function returnThis(this: any) {
    return this
}

function throwThis(this: any) {
    throw this
}

function defArray(obj, key, val, $) {
    var d
    Object.defineProperty(obj, key, d={
        enumerable: key !== '_',
        configurable: true,
        set: (p) => Array.isArray(p) ? val(p) : (p !== val && val(p())),
        get: () => val
    })
    $ && Object.defineProperty($, key, d)
}

function defScalar(obj, key, val, $) {
    const s = S.data(val)
    Object.defineProperty(obj, key, {
        enumerable: key !== '_',
        configurable: true,
        set: s,
        get: s
    })
    
    $ && Object.defineProperty($, key, {
        enumerable: key !== '_',
        configurable: true,
        set: throwThis.bind('Cannot set ' + key),
        get: returnThis.bind(s)
    })
}

function makeReactive(obj: any, key: string, val: any, $: any) {
    var pd
    if (val === null || val === undefined) {
        defScalar(obj, key, val, $)
    } else if (typeof val === 'function' || (pd = Object.getOwnPropertyDescriptor(obj, key)) && pd.configurable === false) {
        if ($) $[key] = val
    } else if (Array.isArray(val)) {
        defArray(obj, key, SArray(val), $)
    } else if (typeof val === 'object') {
        observable(val, $ && ($[key] = {}))
    } else {
        defScalar(obj, key, val, $)
    }
}

/**
 * Make the object/pojo observable.
 */
export function observable<T>(obj: T, $?: any): T {
    if ($ && typeof $ !== 'object') {
        $ = undefined
    }
    for (let key of Object.keys(obj)) {
        makeReactive(obj, key, obj[key], $)
    }
    $ && Object.defineProperty(obj, '$', {
        enumerable: false,
        writable: false,
        value: $
    })
    return obj
}

function freezeFn(obj, fn) {
    return function(arg) {
        return S.freeze(() => fn.call(obj, arg))
    }
}

export function bindPrototypeTo<T>(obj, pt: T): T {
    var x: any
    
    x = {}
    for (let key of Object.keys(pt)) {
        if (key === 'constructor') {
            // ignore
        } else if ('$' === key.charAt(key.length - 1)) {
            x[key] = freezeFn(obj, pt[key])
        } else {
            Object.defineProperty(obj, key, {
                enumerable: false,
                writable: false,
                value: (x[key] = pt[key].bind(obj))
            })
        }
    }
    
    return x as T
}

/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export function wrapAndBindTo(obj, fn: Function) : Function {
    return S(fn.bind(obj))
}

/**
 * Resolves the property value and returns the default if undefined.
 */
export function prop<T>(val: any, def?: T): T {
    return typeof val === 'function' ? val() : (val === undefined ? def : val)
}

export function $$(obj: any, field?: string): any {
    if (field) obj = obj[field]
    
    return typeof obj === 'function' ? obj() : obj
}

