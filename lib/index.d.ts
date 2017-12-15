/**
 * Make the object observable.
 */
export declare function observable<T>(obj: T): T;
/**
 * Bind the function to the object and wrap it on a dependency tracker.
 */
export declare function bindTo(obj: any, fn: Function): Function;
/**
 * Ignore this.
 */
export declare function prop<T>(array: any, def: T): T;
