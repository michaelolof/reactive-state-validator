import { max } from "./max.js";
import { min } from "./min.js";
export const range = (minimum, maximum) => (value) => {
    const smallEnough = () => min(minimum)(value).isValid;
    const bigEnough = () => max(maximum)(value).isValid;
    if ((smallEnough() && bigEnough()))
        return {
            isValid: true,
            rule: "range",
        };
    else
        return { isValid: false, rule: "range" };
};
