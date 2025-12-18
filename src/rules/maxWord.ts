import { type Validation } from "./index";


export const maxWord = (maximum: number) => (value: any): Validation<"maxWord"> => {

    const words = (value+"").trim().split(" ").filter((n) => n.length > 0);
    if(maximum >= words.length) return {
        isValid: true,
        rule: "maxWord",
    };

    else return { isValid: false, rule: "maxWord" };
  
};