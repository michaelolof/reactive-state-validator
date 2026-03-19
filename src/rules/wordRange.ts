import { type Validation } from "./index.js";
import { maxWord } from "./maxWord.js";
import { minWord } from "./minWord.js";



export const wordRange = (minimum: number, maximum: number) => (value: any): Validation<"wordRange"> => {

    const smallEnough = () => minWord(minimum)(value).isValid;
    const bigEnough = () => maxWord(maximum)(value).isValid;

    if(smallEnough() && bigEnough()) return {
        isValid: true,
        rule: "wordRange",
    };

    else return { isValid: false, rule: "wordRange" };
};