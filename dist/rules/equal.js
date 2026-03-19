import { isEqual } from "../utils.js";
export const equal = (compare) => (value) => {
    if (isEqual(compare, value)) {
        return {
            isValid: true,
            rule: "equal",
        };
    }
    else
        return { isValid: false, rule: "equal" };
};
