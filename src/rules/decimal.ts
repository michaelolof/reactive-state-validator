import { type Validation } from "./index";


export const decimal = (value: any): Validation<"decimal"> => {

    const isDecimal = () => /^[-]?\d*(\.\d+)?$/.test(value);

    if(isDecimal()) return {
        isValid: true,
        rule: "decimal",
    };

    else return { isValid: false, rule: "decimal" };

};