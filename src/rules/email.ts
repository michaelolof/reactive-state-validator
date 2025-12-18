import { type Validation } from "./index";


export const email = (value: any): Validation<"email"> => {

    const isEmail = () => /.+@.+/.test(value);

    if(isEmail()) return {
        isValid: true,
        rule: undefined,
    };

    else return { isValid: false, rule: "email" };

};