import S from 's-js'
import SArray from 's-array'

function makeReactive(obj: any, key: string, val: any) {
    if (Array.isArray(val)) {
        obj[key] = SArray(val)
        return
    } else if (typeof val === 'function') {
        return
    }
    
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }
    
    if (typeof val === 'object') {
        observable(val)
        return
    }
    
    // cater for pre-defined getter/setters
    const getter = property && property.get
    const setter = property && property.set
    const s = S.data(val)

    Object.defineProperty(obj, key, {
        enumerable: key !== '_',
        configurable: true,
        //get: () => isArray ? s : s(),
        get: s,
        set: s
    })
}

/**
 * Make the object observable.
 */
export function observable<T>(obj: T): T {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        makeReactive(obj, keys[i], obj[keys[i]])
    }
    
    return obj
}

/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export function bindTo(obj, fn: Function) : Function {
    return S(fn.bind(obj))
}

/**
 * Ignore this.
 */
export function prop<T>(array: any, def: T): T {
    if (!Array.isArray(array))
        return array === undefined ? def : array
    
    switch (array.length) {
        case 1: return array[0]
        case 2: return array[0][array[1]]
        case 3: return array[0][array[1]] ? array[2] : def
        case 4: return array[0][array[1]] ? array[2] : array[3]
        default: return def
    }
}

