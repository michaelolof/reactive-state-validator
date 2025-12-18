export const alpha = (value) => {
    const isAlpha = (val) => /^[A-Za-z]+$/.test(val);
    if (isAlpha(value))
        return {
            isValid: true,
            rule: "alpha",
        };
    else
        return {
            isValid: false,
            rule: "alpha",
        };
};
