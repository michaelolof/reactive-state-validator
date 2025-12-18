import { type Validation } from "./index";



export const alpha = (value: any): Validation<"alpha"> => {

    const isAlpha = (val: string) => /^[A-Za-z]+$/.test(val);

    if(isAlpha(value)) return {
        isValid: true,
        rule: "alpha",
    };

    else return { 
        isValid: false, 
        rule: "alpha", 
    };
  
};