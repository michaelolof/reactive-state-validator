export const match = (compare) => (value) => {
    try {
        if (((value + "").match(compare) || []).length > 0) {
            return {
                isValid: true,
                rule: undefined,
            };
        }
        else
            return { isValid: false, rule: "match" };
    }
    catch (_a) {
        return { isValid: false, rule: "match" };
    }
};
