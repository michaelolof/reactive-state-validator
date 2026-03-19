import { type Validation } from "./index.js";


export const macAddress = (value: any): Validation<"macAddress"> => {

    const isMac = () => /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(value);

    if(isMac()) return {
        isValid: true,
        rule: "macAddress",
    };

    else return { isValid: false, rule: "macAddress" };

};