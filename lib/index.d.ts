export { default as newSArray } from 's-array';
/**
 * Make the object/pojo observable.
 */
export declare function observable<T>(obj: T, $?: any): T;
export declare const enum BindFlags {
    OVERWRITE = 1,
    OWN_KEYS = 2,
}
export declare function bindPrototypeTo<T>(obj: any, pt: T, flags?: BindFlags, freezeSuffix?: string): T;
/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export declare function wrapAndBindTo(obj: any, fn: Function): Function;
/**
 * Resolves the property value and returns the default if undefined.
 */
export declare function prop<T>(val: any, def?: T): T;
export declare function $$(obj: any, field?: string): any;
