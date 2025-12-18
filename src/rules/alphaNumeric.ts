import { type Validation } from "./index";



export const alphaNumeric = (value: any): Validation<"alphaNumeric"> => {

    if(isAlphaNumeric(value)) return {
        isValid: true,
        rule: "alphaNumeric",
    };

    else return { isValid: false, rule: "alphaNumeric" };
  
};

function isAlphaNumeric(str: any) {
    let code, 
        i, 
        len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}