import { type Validation } from "./index.js";


export const maxChar = (maximum: number) => (value: any): Validation<"maxChar"> => {

    const smaller = (val: any) => (val+"").length <= maximum;
  
    if(smaller(value)) return {
        isValid: true,
        rule: "maxChar",
    };

    else return { isValid: false, rule: "maxChar" };
};