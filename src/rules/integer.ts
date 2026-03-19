import { type Validation } from "./index.js";


export const integer = (value: any): Validation<"integer"> => {

    const isInteger = () => /(^[0-9]*$)|(^-[0-9]+$)/.test(value);

    if(isInteger()) return {
        isValid: true,
        rule: "integer",
    };

    else return { isValid: false, rule: "integer" };

};