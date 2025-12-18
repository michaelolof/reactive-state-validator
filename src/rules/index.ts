export interface Validation<T extends string> {
    isValid: boolean;
    rule?: T;
    errors?: string[]
}


export type Rule<T extends string> = (value: any) => Validation<T>;

export const comparisonValue = (val: any) => { 
    if(typeof val === "string") val = val.trim();
    return Array.isArray(val) ? val.length : !isNaN(parseFloat(val)) ? parseFloat(val) : (val+"").length;
};