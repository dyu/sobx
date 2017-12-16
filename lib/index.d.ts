/**
 * Make the object/pojo observable.
 */
export declare function observable<T>(obj: T, $?: any): T;
/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export declare function bindTo(obj: any, fn: Function): Function;
/**
 * Resolves the property value.
 */
export declare function prop<T>(val: any, def: T): T;
