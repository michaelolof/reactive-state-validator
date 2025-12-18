import { type Rule, type Validation } from "./rules/index";
type Valuer = {
    value: any;
};
export interface Err {
    [x: string]: any;
    $isEmpty?: boolean;
    $isWrong?: boolean;
    $rule?: string;
    $msg?: string;
    $msgs?: Record<string, string>;
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
    ref?: Valuer;
    rules?: Rule<string> | Rule<string>[];
    validateIf?: ValidateIfCondition;
    msg?: string;
    msgs?: Record<string, string>;
};
type ResolveValidatorDefinition<T extends {
    rules: Rule<string> | Rule<string>[];
}> = {
    ref: () => Valuer | undefined;
    rules: Rule<InferRules<T>>[];
    validateIf: () => boolean;
    err: Err;
};
type ValidationDefinitions = Record<string, ValidatorDefinition>;
type ResolvedValidatorDefinitionx<D extends ValidationDefinitions> = {
    [K in keyof D]: ResolveValidatorDefinition<D[K]>;
};
export declare function defineValidations<D extends ValidationDefinitions>(options: D): Reporter<D, ResolvedValidatorDefinitionx<D>>;
export declare class Reporter<D extends ValidationDefinitions, R extends ResolvedValidatorDefinitionx<D>> {
    options: R;
    constructor(opts: D);
    setup(opts: D): void;
    clear(name: keyof R): void;
    isWrong(name: keyof R): boolean;
    isEmpty(name: keyof R): boolean;
    msg<N extends keyof R>(name: keyof R, rule?: InferRules<R[N]>): string;
    /**
     * Returns the failing validation rule for a given name. Will return an empty string if all rules passed validation
     */
    rule<N extends keyof R>(name: N): InferRules<R[N]> | undefined;
    /**
     * Checks whether a given name has failed validation (i.e. whether the value is isEmpty or isWrong)
     */
    isInvalid(name: keyof R): boolean;
    /**
     * Check whether a given name and rule failed validation
     */
    ruleIsInvalid<N extends keyof R>(name: N, ...rules: InferRules<R[N]>[]): boolean;
    /**
     * Returns true if the defined and mutates the internal err object
     */
    validate(...names: (keyof R)[]): boolean;
    /**
     * Returns true if all the defined validation rules and mutate the internal err object.
     */
    validateAll(): boolean;
    /**
     * Returns true if the defined. Does not mutate the internal err object
     */
    check(...names: (keyof R)[]): boolean;
    /**
     * Returns true if all the defined validation rules. Does not mutate the internal err object.
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