import { type Rule, type Validation } from "./rules/index.js";
import { isEmpty, required } from "./rules/required.js";
import { set, unset } from "./utils.js";
import { reactive } from "@vue/reactivity";

type Valuer = {
    value: any;
};

export interface Err {
    [x: string]: any;
    $isEmpty?: boolean;
    $isWrong?: boolean;
    $rule?: string;
}

type ErrorContext = {
    $isEmpty?: boolean;
    $isWrong?: boolean;
    $rule?: string;
    val(): any;
}

type Dictionary<V> = {
    [key: string]: V;
};


type InferRules<D extends { rules: any }> = D["rules"] extends ((val: any) => Validation<(infer U)>)[]
    ? U
    : string;

type ValidateIfCondition = boolean | (() => boolean)


export type ValidatorDefinition = {
    val?: () => any;
    rules?: Rule<string> | Rule<string>[];
    validateIf?: ValidateIfCondition;
    msg?: string | (() => string);
};

type ResolveValidatorDefinition<T extends { rules: Rule<string> | Rule<string>[] }> = {
    ref: () => Valuer | undefined;
    rules: Rule<InferRules<T>>[];
    validateIf: () => boolean;
    msg: (() => string);
    err: Err;
};

type ValidationDefinitions = Record<string, ValidatorDefinition>;

type ResolvedValidatorDefinitionx<D> = {
    // @ts-expect-error "Not sure how to handle the undefined yet"
    [K in keyof D]: ResolveValidatorDefinition<D[K]>
};

function resolveOptions<D extends ValidationDefinitions, R extends ResolvedValidatorDefinitionx<D>>(options: D): R {
    const resolved = {} as R;

    for (const name in options) {
        const o = options[name];
        //@ts-expect-error I know what I'm doing
        resolved[name] = {
            ref: () => ({ value: o?.val ? o.val() : undefined }),
            rules: resolveRules<any>(o?.rules),
            validateIf: resolveValidateIf(o?.validateIf),
            msg: resolveErrorMsg(o?.msg),
            err: reactive<Err>({
                $isEmpty: undefined,
                $isWrong: undefined,
                $rule: undefined,
            }),
        };
    }

    return resolved;
}

function resolveErrorMsg(msg?: string | ((c: ErrorContext) => string)): (c: ErrorContext) => string {
    if (!msg) {
        return () => "";
    } else if (typeof msg === "function") {
        return msg;
    } else {
        return () => msg;
    }
}

export function defineValidations<D extends ValidationDefinitions>(options: D): Reporter<D, ResolvedValidatorDefinitionx<D>> {
    return new Reporter(options);
}

export class Reporter<D extends ValidationDefinitions, R extends ResolvedValidatorDefinitionx<D>> {

    options = {} as R;

    constructor(opts: D) {
        this.loadOptions(opts)
    }

    /**
     * Mostly for asynchronous loading of validator options
     */
    loadOptions(opts: D) {
        this.options = resolveOptions(opts)
    }

    /**
     * Clear mutated error reports for the specified validation fields
     */
    clear(...names: (keyof R)[]) {
        for (const name of names) {
            const option = this.options[name];
            if (!option || !option.validateIf()) {
                continue;
            }

            option.err.$rule = undefined;
            option.err.$isEmpty = undefined;
            option.err.$isWrong = undefined;
        }
    }

    /**
     * Clear mutated error reports for all validation fields
     */
    clearAll() {
        for (const name in this.options) {
            const option = this.options[name];
            if (!option || !option.validateIf()) {
                continue;
            }

            option.err.$rule = undefined;
            option.err.$isEmpty = undefined;
            option.err.$isWrong = undefined;
        }
    }

    isWrong(name: keyof R): boolean {
        const option = this.options[name];
        if (!option || !option.validateIf()) {
            return false;
        }

        return option.err.$isWrong || false;
    }

    isEmpty(name: keyof R): boolean {
        const option = this.options[name];
        if (!option || !option.validateIf) {
            return false;
        }

        return option.err?.$isEmpty || false;
    }

    msg(name: keyof R): string {
        const opt = this.options[name]
        if (!opt.err.$isEmpty && !opt.err.$isWrong) {
            return ""
        }

        return opt.msg()
    }

    /**
     * Returns the failing validation rule for a given name. Will return an empty string if all rules passed validation
     */
    rule<N extends keyof R>(name: N): InferRules<R[N]> | undefined {
        const option = this.options[name];
        if (!option || !option.validateIf()) {
            return undefined;
        }

        return (option.err.$rule as any) || undefined;
    }

    /**
     * Checks whether a given name has failed validation (i.e. whether the value is isEmpty or isWrong)
     */
    hasFailed(name: keyof R): boolean {
        return this.isEmpty(name) || this.isWrong(name);
    }

    /**
     * Checks whether a given name has failed validation because of the specified rules
     */
    failedOn<N extends keyof R>(name: N, ...rules: InferRules<R[N]>[]): boolean {
        const option = this.options[name];
        if (!option || !option.validateIf()) {
            return false;
        }

        for (const rule of rules) {
            if (rule === "required") {
                if (this.isEmpty(name)) {
                    return true;
                }
            } else if (option.err.$rule === rule) {
                if (option.err.$isWrong) {
                    return true;
                }
            }
        }

        return false
    }

    /**
     * Returns true if the specified validation rules are valid and also mutates the internal err object
     */
    validate(...names: (keyof R)[]): boolean {
        let rtn = true;
        for (const name of names) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }

            const isValid = validateFieldAndMutate(option.ref()?.value, option.err, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }

        return rtn;
    }

    /**
     * Returns true if all the defined validation rules are valid and also mutates the internal err object.
     */
    validateAll(): boolean {
        let rtn = true;
        for (const name in this.options) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }

            const isValid = validateFieldAndMutate(option.ref()?.value, option.err, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }

        return rtn;
    }

    /**
     * Returns true if the defined. Does not mutate the internal err object
     */
    check(...names: (keyof R)[]): boolean {
        let rtn = true;
        for (const name of names) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }

            const isValid = validateValue(option.ref()?.value, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }

        return rtn;
    }

    /**
     * Returns true if all the defined validation rules are valid. Does not mutate the internal err object.
     */
    checkAll(): boolean {
        let rtn = true;
        for (const name in this.options) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }

            const isValid = validateValue(option.ref()?.value, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }

        return rtn;
    }
}

interface ValidatorOption {
    value: any;
    rules?: Rule<string> | Rule<string>[];
    validateIf: () => boolean;
}

interface MutatingValidatorOption {
    value: any;
    err: object;
    rules?: Rule<string> | Rule<string>[];
    validateIf: () => boolean;
}


function validate(options: ValidatorOption[]): boolean {

    return _v(resolvePureValidationOptions(options));

    //---------------------------------------------------------
    function _v(options: PureValidatedOption[]) {

        for (const option of options) {

            if (!option.validateIf()) continue;

            const optionIsValid = validateValue(option.value, option.rules);

            if (optionIsValid === false) return false;

        }

        return true;
    }
}


export function validateValue(value: any, rules: Rule<string>[]): boolean {

    for (const rule of rules) {
        const validation = validateAsOptional(value, rule);
        if (!validation.isValid) return false;
    }

    return true;
}


function validateFieldAndMutate(value: any, err: Err, rules: Rule<string>[]): boolean {
    for (const rule of rules) {

        const validation = validateAsOptional(value, rule);
        if (!validation.isValid) {

            if (validation.rule === "required") {
                set(err, "$isEmpty", true);
                unset(err, "$isWrong");
            } else {
                set(err, "$isWrong", true);
                unset(err, "$isEmpty");
            }

            set(err, "$rule", validation.rule);

            return false;

        } else {
            invalidateMutatedField(err);
        }

    }

    return true;

}


function invalidateMutatedField(target: object) {
    unset(target, "$isEmpty");
    unset(target, "$isWrong");
    unset(target, "$rule");
}


function validateAsOptional(value: any, rule: (value: any) => Validation<string>): Validation<string> {

    const intialValidation = rule(value);
    if (intialValidation.rule === "required") return intialValidation;

    if (isEmpty(value) || intialValidation.isValid) return {
        isValid: true,
        rule: undefined,
    };

    else return { isValid: false, rule: intialValidation.rule };

}


function resolvePureValidationOptions(options: ValidatorOption[]): PureValidatedOption[] {
    return options.map(resolvePureValidationOption);
}


function resolvePureValidationOption(option: ValidatorOption): PureValidatedOption {
    return {
        value: option.value,
        rules: resolveRules(option.rules),
        validateIf: resolveValidateIf(option.validateIf),
    };
}


function resolveMutatingValidationOptions(options: MutatingValidatorOption[]): MutatingValidatedOption[] {

    return options.filter((o) => !!o).map(resolveMutatingValidationOption);

}


function resolveMutatingValidationOption(option: MutatingValidatorOption): MutatingValidatedOption {

    if (!option.err) throw new Error("VueStateValidatorError: err is a required field\n\r" + JSON.stringify(option));
    else if (typeof option.err !== "object") throw new Error("VueStateValidatorError: Unknown err type entered. err should be an object\n\r" + JSON.stringify(option));

    return {
        value: option.value,
        err: option.err,
        rules: resolveRules(option.rules),
        validateIf: resolveValidateIf(option.validateIf),
    };
}


function resolveRules<R extends string>(rules?: Rule<any> | Rule<any>[]): Rule<R & "required">[] {
    return rules && Array.isArray(rules)
        ? rules : rules && typeof rules === "function"
            //@ts-ignore
            ? [rules] : [required];
}


function resolveValidateIf(validateIf?: ValidateIfCondition): (() => boolean) {
    if (!validateIf) {
        return () => true
    } else if (typeof validateIf === "boolean") {
        return () => validateIf
    } else {
        return validateIf
    }
}



interface PureValidatedOption {
    value?: any;
    rules: Rule<string>[];
    validateIf: () => boolean;
}

export interface MutatingValidatedOption {
    value: any;
    err: Dictionary<any>;
    rules: Rule<string>[];
    validateIf: ValidateIfCondition;
}