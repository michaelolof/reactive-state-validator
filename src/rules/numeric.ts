import { type Validation } from "./index.js";



export const numeric = (value: any): Validation<"numeric"> => {

    if(!isNaN(value)) return {
        isValid: true,
        rule: "numeric", 
    };

    else return { isValid: false, rule: "numeric" };
  
};