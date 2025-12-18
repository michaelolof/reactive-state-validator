export const integer = (value) => {
    const isInteger = () => /(^[0-9]*$)|(^-[0-9]+$)/.test(value);
    if (isInteger())
        return {
            isValid: true,
            rule: "integer",
        };
    else
        return { isValid: false, rule: "integer" };
};
