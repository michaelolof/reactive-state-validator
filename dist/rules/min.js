import { comparisonValue } from "./index";
export const min = (minimum) => (value) => {
    if (minimum <= comparisonValue(value))
        return {
            isValid: true,
            rule: "min",
        };
    else
        return { isValid: false, rule: "min" };
};
