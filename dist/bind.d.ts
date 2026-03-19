import { Rule } from "./rules/index.js";
export declare function defineFieldBinder(...selectors: string[] | HTMLElement[]): FieldBinder;
export declare class FieldBinder {
    #private;
    constructor(fields: HTMLElement[]);
    prevent(rules: Rule<string>[]): void;
    allow(rules: Rule<string>[]): void;
    max(limit: number): void;
    cleanup(): void;
}
//# sourceMappingURL=bind.d.ts.map