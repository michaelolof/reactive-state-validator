export const numeric = (value) => {
    if (!isNaN(value))
        return {
            isValid: true,
            rule: "numeric",
        };
    else
        return { isValid: false, rule: "numeric" };
};
