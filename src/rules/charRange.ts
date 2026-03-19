import { type Validation } from "./index.js";
import { minChar } from "./minChar.js";
import { maxChar } from "./maxChar.js";



export const charRange = (minimum: number, maximum: number) => (value: any): Validation<"charRange"> => {

    const smallEnough = () => minChar(minimum)(value).isValid;
    const bigEnough = () => maxChar(maximum)(value).isValid;

    if((smallEnough() && bigEnough())) return {
        isValid: true,
        rule: "charRange",
    };

    else return { isValid: false, rule: "charRange" };

};