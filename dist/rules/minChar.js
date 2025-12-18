export const minChar = (minimum) => (value) => {
    if ((value + "").length >= minimum)
        return {
            isValid: true,
            rule: "minChar",
        };
    else
        return { isValid: false, rule: "minChar" };
};
