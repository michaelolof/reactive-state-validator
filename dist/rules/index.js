export const comparisonValue = (val) => {
    if (typeof val === "string")
        val = val.trim();
    return Array.isArray(val) ? val.length : !isNaN(parseFloat(val)) ? parseFloat(val) : (val + "").length;
};
