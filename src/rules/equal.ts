import { isEqual } from "../utils.js";
import { type Validation } from "./index.js";


export const equal = (compare: any) => (value: any): Validation<"equal"> => {

    if(isEqual(compare, value)) {
        return {
            isValid: true,
            rule: "equal",
        };
    } else return { isValid: false, rule: "equal" };
  
};