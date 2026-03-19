import { Validation } from "./rules/index.js";
export declare function isControlKey(evt: any): boolean;
export declare function set(target: any, key: string, value: any): void;
export declare function unset(target: any, key: string): void;
export declare function toRegex(val: any): RegExp | undefined;
export declare function objectIsEmpty(obj: any): boolean;
export declare function objectHasProperty(obj: any, prop: string): boolean;
export declare function isEqual(value: any, other: any): boolean;
export declare function debounce(fn: (...args: any) => any, ms: number, eventName?: string): void;
export declare const constants: {
    Vue: VueObj | undefined;
    debounceEvents: {
        [x: string]: any;
    };
};
interface VueObj {
    set(target: any, key: string, value: any): void;
    delete(target: any, key: string): void;
}
type CustomOption<T> = {
    name: T;
    rule: (val: any) => (boolean | {
        isValid: boolean;
        errors?: string[];
    });
};
export declare const createRule: <T extends string>(opt: CustomOption<T>) => (val: any) => Validation<T>;
export {};
//# sourceMappingURL=utils.d.ts.map