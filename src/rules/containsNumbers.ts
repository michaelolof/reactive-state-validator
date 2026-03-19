import { type Validation } from "./index.js";



export const containsNumber = (size: number) => (value: any): Validation<"containsNumber"> => {

    const numbersFound = () => {
        let found = 0;
        for(const char of (value)+"") {
            const charIsNumber = isNaN(char as any) === false;
            if(charIsNumber ) found++;
        }
        return found;
    };

    if(numbersFound() >= size) return {
        isValid: true,
        rule: "containsNumber",
    };

    else return { isValid: false, rule: "containsNumber" };
  
};