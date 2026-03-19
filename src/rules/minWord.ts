import { type Validation } from "./index.js";


export const minWord = (minimum: number) => (value: any): Validation<"minWord"> => {

    const words = (value+"").trim().split(" ").filter((n) => n.length > 0);
    if(minimum <= words.length) return {
        isValid: true,
        rule: "minWord",
    };

    else return { isValid: false, rule: "minWord" };
  
};