import { type Validation } from "./index";


export const minChar = (minimum: number) => (value: any): Validation<"minChar"> => {

    if((value+"").length >= minimum) return {
        isValid: true,
        rule: "minChar",
    };

    else return { isValid: false, rule: "minChar" };
};