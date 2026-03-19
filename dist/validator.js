import { isEmpty, required } from "./rules/required.js";
import { set, unset } from "./utils.js";
import { reactive } from "@vue/reactivity";
function resolveOptions(options) {
    const resolved = {};
    for (const name in options) {
        const o = options[name];
        //@ts-expect-error I know what I'm doing
        resolved[name] = {
            ref: () => ({ value: (o === null || o === void 0 ? void 0 : o.val) ? o.val() : undefined }),
            rules: resolveRules(o === null || o === void 0 ? void 0 : o.rules),
            validateIf: resolveValidateIf(o === null || o === void 0 ? void 0 : o.validateIf),
            msg: resolveErrorMsg(o === null || o === void 0 ? void 0 : o.msg),
            err: reactive({
                $isEmpty: undefined,
                $isWrong: undefined,
                $rule: undefined,
            }),
        };
    }
    return resolved;
}
function resolveErrorMsg(msg) {
    if (!msg) {
        return () => "";
    }
    else if (typeof msg === "function") {
        return msg;
    }
    else {
        return () => msg;
    }
}
export function defineValidations(options) {
    return new Reporter(options);
}
export class Reporter {
    constructor(opts) {
        this.options = {};
        this.loadOptions(opts);
    }
    /**
     * Mostly for asynchronous loading of validator options
     */
    loadOptions(opts) {
        this.options = resolveOptions(opts);
    }
    /**
     * Clear mutated error reports for the specified validation fields
     */
    clear(...names) {
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
    isWrong(name) {
        const option = this.options[name];
        if (!option || !option.validateIf()) {
            return false;
        }
        return option.err.$isWrong || false;
    }
    isEmpty(name) {
        var _a;
        const option = this.options[name];
        if (!option || !option.validateIf) {
            return false;
        }
        return ((_a = option.err) === null || _a === void 0 ? void 0 : _a.$isEmpty) || false;
    }
    msg(name) {
        const opt = this.options[name];
        if (!opt.err.$isEmpty && !opt.err.$isWrong) {
            return "";
        }
        return opt.msg();
    }
    /**
     * Returns the failing validation rule for a given name. Will return an empty string if all rules passed validation
     */
    rule(name) {
        const option = this.options[name];
        if (!option || !option.validateIf()) {
            return undefined;
        }
        return option.err.$rule || undefined;
    }
    /**
     * Checks whether a given name has failed validation (i.e. whether the value is isEmpty or isWrong)
     */
    hasFailed(name) {
        return this.isEmpty(name) || this.isWrong(name);
    }
    /**
     * Checks whether a given name has failed validation because of the specified rules
     */
    failedOn(name, ...rules) {
        const option = this.options[name];
        if (!option || !option.validateIf()) {
            return false;
        }
        for (const rule of rules) {
            if (rule === "required") {
                if (this.isEmpty(name)) {
                    return true;
                }
            }
            else if (option.err.$rule === rule) {
                if (option.err.$isWrong) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns true if the specified validation rules are valid and also mutates the internal err object
     */
    validate(...names) {
        var _a;
        let rtn = true;
        for (const name of names) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }
            const isValid = validateFieldAndMutate((_a = option.ref()) === null || _a === void 0 ? void 0 : _a.value, option.err, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }
        return rtn;
    }
    /**
     * Returns true if all the defined validation rules are valid and also mutates the internal err object.
     */
    validateAll() {
        var _a;
        let rtn = true;
        for (const name in this.options) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }
            const isValid = validateFieldAndMutate((_a = option.ref()) === null || _a === void 0 ? void 0 : _a.value, option.err, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }
        return rtn;
    }
    /**
     * Returns true if the defined. Does not mutate the internal err object
     */
    check(...names) {
        var _a;
        let rtn = true;
        for (const name of names) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }
            const isValid = validateValue((_a = option.ref()) === null || _a === void 0 ? void 0 : _a.value, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }
        return rtn;
    }
    /**
     * Returns true if all the defined validation rules are valid. Does not mutate the internal err object.
     */
    checkAll() {
        var _a;
        let rtn = true;
        for (const name in this.options) {
            const option = this.options[name];
            if (!option.validateIf()) {
                continue;
            }
            const isValid = validateValue((_a = option.ref()) === null || _a === void 0 ? void 0 : _a.value, option.rules);
            if (!isValid) {
                rtn = false;
            }
        }
        return rtn;
    }
}
function validate(options) {
    return _v(resolvePureValidationOptions(options));
    //---------------------------------------------------------
    function _v(options) {
        for (const option of options) {
            if (!option.validateIf())
                continue;
            const optionIsValid = validateValue(option.value, option.rules);
            if (optionIsValid === false)
                return false;
        }
        return true;
    }
}
export function validateValue(value, rules) {
    for (const rule of rules) {
        const validation = validateAsOptional(value, rule);
        if (!validation.isValid)
            return false;
    }
    return true;
}
function validateFieldAndMutate(value, err, rules) {
    for (const rule of rules) {
        const validation = validateAsOptional(value, rule);
        if (!validation.isValid) {
            if (validation.rule === "required") {
                set(err, "$isEmpty", true);
                unset(err, "$isWrong");
            }
            else {
                set(err, "$isWrong", true);
                unset(err, "$isEmpty");
            }
            set(err, "$rule", validation.rule);
            return false;
        }
        else {
            invalidateMutatedField(err);
        }
    }
    return true;
}
function invalidateMutatedField(target) {
    unset(target, "$isEmpty");
    unset(target, "$isWrong");
    unset(target, "$rule");
}
function validateAsOptional(value, rule) {
    const intialValidation = rule(value);
    if (intialValidation.rule === "required")
        return intialValidation;
    if (isEmpty(value) || intialValidation.isValid)
        return {
            isValid: true,
            rule: undefined,
        };
    else
        return { isValid: false, rule: intialValidation.rule };
}
function resolvePureValidationOptions(options) {
    return options.map(resolvePureValidationOption);
}
function resolvePureValidationOption(option) {
    return {
        value: option.value,
        rules: resolveRules(option.rules),
        validateIf: resolveValidateIf(option.validateIf),
    };
}
function resolveMutatingValidationOptions(options) {
    return options.filter((o) => !!o).map(resolveMutatingValidationOption);
}
function resolveMutatingValidationOption(option) {
    if (!option.err)
        throw new Error("VueStateValidatorError: err is a required field\n\r" + JSON.stringify(option));
    else if (typeof option.err !== "object")
        throw new Error("VueStateValidatorError: Unknown err type entered. err should be an object\n\r" + JSON.stringify(option));
    return {
        value: option.value,
        err: option.err,
        rules: resolveRules(option.rules),
        validateIf: resolveValidateIf(option.validateIf),
    };
}
function resolveRules(rules) {
    return rules && Array.isArray(rules)
        ? rules : rules && typeof rules === "function"
        //@ts-ignore
        ? [rules] : [required];
}
function resolveValidateIf(validateIf) {
    if (!validateIf) {
        return () => true;
    }
    else if (typeof validateIf === "boolean") {
        return () => validateIf;
    }
    else {
        return validateIf;
    }
}
