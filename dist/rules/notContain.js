import { contains } from "./contains.js";
export const notContain = (content) => (value) => {
    if (contains(content)(value).isValid === false)
        return {
            isValid: true,
            rule: "notContain",
        };
    else
        return { isValid: false, rule: "notContain" };
};
