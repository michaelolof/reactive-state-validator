import { maxWord } from "./maxWord.js";
import { minWord } from "./minWord.js";
export const wordRange = (minimum, maximum) => (value) => {
    const smallEnough = () => minWord(minimum)(value).isValid;
    const bigEnough = () => maxWord(maximum)(value).isValid;
    if (smallEnough() && bigEnough())
        return {
            isValid: true,
            rule: "wordRange",
        };
    else
        return { isValid: false, rule: "wordRange" };
};
