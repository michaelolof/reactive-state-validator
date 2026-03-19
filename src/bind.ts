import { Rule } from "./rules/index.js";
import { max } from "./rules/max.js";
import { isControlKey } from "./utils.js";
import { validateValue } from "./validator.js";

export function defineFieldBinder(...selectors: string[] | HTMLElement[]) {
    const forms: HTMLElement[] = [];
    try {
        for (const selector of selectors) {
            if (document === undefined || window == undefined) {
                continue;
            }

            const form = typeof selector === "object" ? selector : (document.querySelector<HTMLElement>(selector) ?? undefined);
            if (form === undefined) {
                console.warn(`target element ${selector} was not found`);
                continue;
            }

            forms.push(form)
        }
    } catch (e) {
        console.warn(e);
    }

    return new FieldBinder(forms);
}

export class FieldBinder {
    #field: HTMLElement[]
    #isPreventing = false;
    #isAllowing = false
    #isMaxing = false

    constructor(fields: HTMLElement[]) {
        this.#field = fields;
    }

    prevent(rules: Rule<string>[]) {
        this.#isPreventing = true;
        for (const field of this.#field) {
            field.addEventListener("keydown", this.#keyHandler({ field, rules }, this.#preventHandler))
            field.addEventListener("paste", this.#pasteHandler({ field, rules }, this.#preventHandler))
        }
    }

    allow(rules: Rule<string>[]) {
        this.#isAllowing = true;
        for (const field of this.#field) {
            field.addEventListener("keydown", this.#keyHandler({ field, rules }, this.#allowHandler))
            field.addEventListener("paste", this.#pasteHandler({ field, rules }, this.#allowHandler))
        }
    }

    max(limit: number) {
        this.#isMaxing = true
        this.#isAllowing = true;
        const rules = [max(limit)]
        for (const field of this.#field) {
            field.addEventListener("keyup", this.#keyHandler({ field, rules, limit }, this.#maxHandler))
            field.addEventListener("paste", this.#pasteHandler({ field, rules, limit }, this.#maxHandler))
        }
    }

    cleanup() {
        const rules: Rule<string>[] = []
        for (const field of this.#field) {
            if (this.#isPreventing) {
                field.removeEventListener("keydown", this.#keyHandler({ field, rules }, this.#preventHandler))
                field.removeEventListener("paste", this.#pasteHandler({ field, rules }, this.#preventHandler))
                this.#isPreventing = false;
            }

            if (this.#isAllowing) {
                field.removeEventListener("keydown", this.#keyHandler({ field, rules }, this.#allowHandler))
                field.removeEventListener("paste", this.#pasteHandler({ field, rules }, this.#allowHandler))
                this.#isAllowing = false;
            }

            if (this.#isMaxing) {
                field.removeEventListener("keyup", this.#keyHandler({ field, rules }, this.#allowHandler))
                field.removeEventListener("paste", this.#pasteHandler({ field, rules }, this.#allowHandler))
                this.#isMaxing = false;
            }
        }
    }

    #preventHandler(o: HandlerOptions) {
        const isValid = validateValue(o.val, o.rules);
        if ((o.val + "").length && isValid) {
            o.e.preventDefault();
        }
    }

    #allowHandler(o: HandlerOptions) {
        const notValid = !validateValue(o.val, o.rules);
        if ((o.val + "").length && notValid) {
            o.e.preventDefault();
        }
    }

    #maxHandler(o: HandlerOptions) {
        const notValid = !validateValue(o.val, o.rules);
        if ((o.val + "").length && notValid) {
            o.e.preventDefault();
            if (o.field && o.limit && "value" in o.field) {
                o.field.value = String(o.limit || "") || String(o.val)
            }
        }
    }

    #pasteHandler = (opts: ListenerOptions, h: (o: HandlerOptions) => void) => (e: ClipboardEvent) => {
        const val = getClipboardData(e.clipboardData || (window as any)?.clipboardData);
        h({ e, val, rules: opts.rules, field: opts.field, limit: opts.limit });
    }

    #keyHandler = (opts: ListenerOptions, h: (o: HandlerOptions) => void) => (e: KeyboardEvent) => {
        const val = (e.key || "").trim();
        if (isControlKey(e)) {
            return;
        }
        h({ e, val, rules: opts.rules, field: opts.field, limit: opts.limit });
    }
}

type DefaultPreventer = {
    preventDefault(): void;
}

function getClipboardData(val?: object): string {
    if (val && "getData" in val && typeof val.getData === "function") {
        return val.getData("text");
    }
    return "";
}

type ListenerOptions = {
    rules: Rule<string>[];
    field: HTMLElement;
    limit?: number;
}

type HandlerOptions = ListenerOptions & {
    e: DefaultPreventer;
    val: any;
}