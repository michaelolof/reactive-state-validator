export interface Validation<T extends string> {
    isValid: boolean;
    rule?: T;
    errors?: string[];
}
export type Rule<T extends string> = (value: any) => Validation<T>;
export declare const comparisonValue: (val: any) => number;
//# sourceMappingURL=index.d.ts.map