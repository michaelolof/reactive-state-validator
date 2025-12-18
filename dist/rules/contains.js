export const contains = (content) => (value) => {
    const isContain = (val) => (val + "").includes(content);
    if (isContain(value))
        return {
            isValid: true,
            rule: "contains",
        };
    else
        return { isValid: false, rule: "contains" };
};
