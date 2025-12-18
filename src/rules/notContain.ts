import { contains } from "./contains";
import { type Validation } from "./index";



export const notContain = (content: string) => (value: any): Validation<"notContain"> => {

    if(contains(content)(value).isValid === false) return {
        isValid: true,
        rule: "notContain",
    };

    else return { isValid: false, rule: "notContain" };
  
};