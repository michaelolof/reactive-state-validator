import { type Validation } from "./index.js";



export const contains = (content: string) => (value: any): Validation<"contains"> => {

    const isContain = (val: any) => (val+"").includes(content);
  
    if(isContain(value)) return {
        isValid: true,
        rule: "contains",
    };

    else return { isValid: false, rule: "contains" };
  
};