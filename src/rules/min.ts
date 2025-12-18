import { type Validation, comparisonValue } from "./index";


export const min = (minimum: number) => (value: any): Validation<"min"> => {

    if(minimum <= comparisonValue(value)) return {
        isValid: true,
        rule: "min",
    };

    else return { isValid: false, rule: "min" };

};