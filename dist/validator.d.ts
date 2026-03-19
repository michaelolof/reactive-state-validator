import { type Rule, type Validation } from "./rules/index.js";
type Valuer = {
    value: any;
};
export interface Err {
    [x: string]: any;
    $isEmpty?: boolean;
    $isWrong?: boolean;
    $rule?: string;
}
type Dictionary<V> = {
    [key: string]: V;
};
type InferRules<D extends {
    rules: any;
}> = D["rules"] extends ((val: any) => Validation<(infer U)>)[] ? U : string;
type ValidateIfCondition = boolean | (() => boolean);
export type ValidatorDefinition = {
    val?: () => any;
    rules?: Rule<string> | Rule<string>[];
    validateIf?: ValidateIfCondition;
    msg?: string | (() => string);
};
type ResolveValidatorDefinition<T extends {
    rules: Rule<string> | Rule<string>[];
}> = {
    ref: () => Valuer | undefined;
    rules: Rule<InferRules<T>>[];
    validateIf: () => boolean;
    msg: (() => string);
    err: Err;
};
type ValidationDefinitions = Record<string, ValidatorDefinition>;
type ResolvedValidatorDefinitionx<D> = {
    [K in keyof D]: ResolveValidatorDefinition<D[K]>;
};
export declare function defineValidations<D extends ValidationDefinitions>(options: D): Reporter<D, ResolvedValidatorDefinitionx<D>>;
export declare class Reporter<D extends ValidationDefinitions, R extends ResolvedValidatorDefinitionx<D>> {
    options: R;
    constructor(opts: D);
    /**
     * Mostly for asynchronous loading of validator options
     */
    loadOptions(opts: D): void;
    /**
     * Clear mutated error reports for the specified validation fields
     */
    clear(...names: (keyof R)[]): void;
    /**
     * Clear mutated error reports for all validation fields
     */
    clearAll(): void;
    isWrong(name: keyof R): boolean;
    isEmpty(name: keyof R): boolean;
    msg(name: keyof R): string;
    /**
     * Returns the failing validation rule for a given name. Will return an empty string if all rules passed validation
     */
    rule<N extends keyof R>(name: N): InferRules<R[N]> | undefined;
    /**
     * Checks whether a given name has failed validation (i.e. whether the value is isEmpty or isWrong)
     */
    hasFailed(name: keyof R): boolean;
    /**
     * Checks whether a given name has failed validation because of the specified rules
     */
    failedOn<N extends keyof R>(name: N, ...rules: InferRules<R[N]>[]): boolean;
    /**
     * Returns true if the specified validation rules are valid and also mutates the internal err object
     */
    validate(...names: (keyof R)[]): boolean;
    /**
     * Returns true if all the defined validation rules are valid and also mutates the internal err object.
     */
    validateAll(): boolean;
    /**
     * Returns true if the defined. Does not mutate the internal err object
     */
    check(...names: (keyof R)[]): boolean;
    /**
     * Returns true if all the defined validation rules are valid. Does not mutate the internal err object.
     */
    checkAll(): boolean;
}
export declare function validateValue(value: any, rules: Rule<string>[]): boolean;
export interface MutatingValidatedOption {
    value: any;
    err: Dictionary<any>;
    rules: Rule<string>[];
    validateIf: ValidateIfCondition;
}
export {};
//# sourceMappingURL=validator.d.ts.map