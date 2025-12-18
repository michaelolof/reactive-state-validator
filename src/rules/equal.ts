import { isEqual } from "../utils";
import { type Validation } from "./index";


export const equal = (compare: any) => (value: any): Validation<"equal"> => {

    if(isEqual(compare, value)) {
        return {
            isValid: true,
            rule: "equal",
        };
    } else return { isValid: false, rule: "equal" };
  
};