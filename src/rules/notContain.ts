import { contains } from "./contains.js";
import { type Validation } from "./index.js";



export const notContain = (content: string) => (value: any): Validation<"notContain"> => {

    if(contains(content)(value).isValid === false) return {
        isValid: true,
        rule: "notContain",
    };

    else return { isValid: false, rule: "notContain" };
  
};