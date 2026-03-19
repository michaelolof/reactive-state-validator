import { type Validation } from "./index.js";
import { max } from "./max.js";
import { min } from "./min.js";



export const range = (minimum: number, maximum: number) => (value: any): Validation<"range"> => {

    const smallEnough = () => min(minimum)(value).isValid;
    const bigEnough = () => max(maximum)(value).isValid;

    if((smallEnough() && bigEnough())) return {
        isValid: true,
        rule: "range",
    };

    else return { isValid: false, rule: "range" };

};