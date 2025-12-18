import { comparisonValue, type Validation } from "./index";



export const max = (maximum: number) => (value: any): Validation<"max"> => {

    if(maximum >= comparisonValue(value)) return {
        isValid: true,
        rule: "max",
    };

    else return { isValid: false, rule: "max" };
  
};