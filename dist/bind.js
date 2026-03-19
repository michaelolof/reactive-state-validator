var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FieldBinder_instances, _FieldBinder_field, _FieldBinder_isPreventing, _FieldBinder_isAllowing, _FieldBinder_isMaxing, _FieldBinder_preventHandler, _FieldBinder_allowHandler, _FieldBinder_maxHandler, _FieldBinder_pasteHandler, _FieldBinder_keyHandler;
import { max } from "./rules/max.js";
import { isControlKey } from "./utils.js";
import { validateValue } from "./validator.js";
export function defineFieldBinder(...selectors) {
    var _a;
    const forms = [];
    try {
        for (const selector of selectors) {
            if (document === undefined || window == undefined) {
                continue;
            }
            const form = typeof selector === "object" ? selector : ((_a = document.querySelector(selector)) !== null && _a !== void 0 ? _a : undefined);
            if (form === undefined) {
                console.warn(`target element ${selector} was not found`);
                continue;
            }
            forms.push(form);
        }
    }
    catch (e) {
        console.warn(e);
    }
    return new FieldBinder(forms);
}
export class FieldBinder {
    constructor(fields) {
        _FieldBinder_instances.add(this);
        _FieldBinder_field.set(this, void 0);
        _FieldBinder_isPreventing.set(this, false);
        _FieldBinder_isAllowing.set(this, false);
        _FieldBinder_isMaxing.set(this, false);
        _FieldBinder_pasteHandler.set(this, (opts, h) => (e) => {
            const val = getClipboardData(e.clipboardData || (window === null || window === void 0 ? void 0 : window.clipboardData));
            h({ e, val, rules: opts.rules, field: opts.field, limit: opts.limit });
        });
        _FieldBinder_keyHandler.set(this, (opts, h) => (e) => {
            const val = (e.key || "").trim();
            if (isControlKey(e)) {
                return;
            }
            h({ e, val, rules: opts.rules, field: opts.field, limit: opts.limit });
        });
        __classPrivateFieldSet(this, _FieldBinder_field, fields, "f");
    }
    prevent(rules) {
        __classPrivateFieldSet(this, _FieldBinder_isPreventing, true, "f");
        for (const field of __classPrivateFieldGet(this, _FieldBinder_field, "f")) {
            field.addEventListener("keydown", __classPrivateFieldGet(this, _FieldBinder_keyHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_preventHandler)));
            field.addEventListener("paste", __classPrivateFieldGet(this, _FieldBinder_pasteHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_preventHandler)));
        }
    }
    allow(rules) {
        __classPrivateFieldSet(this, _FieldBinder_isAllowing, true, "f");
        for (const field of __classPrivateFieldGet(this, _FieldBinder_field, "f")) {
            field.addEventListener("keydown", __classPrivateFieldGet(this, _FieldBinder_keyHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_allowHandler)));
            field.addEventListener("paste", __classPrivateFieldGet(this, _FieldBinder_pasteHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_allowHandler)));
        }
    }
    max(limit) {
        __classPrivateFieldSet(this, _FieldBinder_isMaxing, true, "f");
        __classPrivateFieldSet(this, _FieldBinder_isAllowing, true, "f");
        const rules = [max(limit)];
        for (const field of __classPrivateFieldGet(this, _FieldBinder_field, "f")) {
            field.addEventListener("keyup", __classPrivateFieldGet(this, _FieldBinder_keyHandler, "f").call(this, { field, rules, limit }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_maxHandler)));
            field.addEventListener("paste", __classPrivateFieldGet(this, _FieldBinder_pasteHandler, "f").call(this, { field, rules, limit }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_maxHandler)));
        }
    }
    cleanup() {
        const rules = [];
        for (const field of __classPrivateFieldGet(this, _FieldBinder_field, "f")) {
            if (__classPrivateFieldGet(this, _FieldBinder_isPreventing, "f")) {
                field.removeEventListener("keydown", __classPrivateFieldGet(this, _FieldBinder_keyHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_preventHandler)));
                field.removeEventListener("paste", __classPrivateFieldGet(this, _FieldBinder_pasteHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_preventHandler)));
                __classPrivateFieldSet(this, _FieldBinder_isPreventing, false, "f");
            }
            if (__classPrivateFieldGet(this, _FieldBinder_isAllowing, "f")) {
                field.removeEventListener("keydown", __classPrivateFieldGet(this, _FieldBinder_keyHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_allowHandler)));
                field.removeEventListener("paste", __classPrivateFieldGet(this, _FieldBinder_pasteHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_allowHandler)));
                __classPrivateFieldSet(this, _FieldBinder_isAllowing, false, "f");
            }
            if (__classPrivateFieldGet(this, _FieldBinder_isMaxing, "f")) {
                field.removeEventListener("keyup", __classPrivateFieldGet(this, _FieldBinder_keyHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_allowHandler)));
                field.removeEventListener("paste", __classPrivateFieldGet(this, _FieldBinder_pasteHandler, "f").call(this, { field, rules }, __classPrivateFieldGet(this, _FieldBinder_instances, "m", _FieldBinder_allowHandler)));
                __classPrivateFieldSet(this, _FieldBinder_isMaxing, false, "f");
            }
        }
    }
}
_FieldBinder_field = new WeakMap(), _FieldBinder_isPreventing = new WeakMap(), _FieldBinder_isAllowing = new WeakMap(), _FieldBinder_isMaxing = new WeakMap(), _FieldBinder_pasteHandler = new WeakMap(), _FieldBinder_keyHandler = new WeakMap(), _FieldBinder_instances = new WeakSet(), _FieldBinder_preventHandler = function _FieldBinder_preventHandler(o) {
    const isValid = validateValue(o.val, o.rules);
    if ((o.val + "").length && isValid) {
        o.e.preventDefault();
    }
}, _FieldBinder_allowHandler = function _FieldBinder_allowHandler(o) {
    const notValid = !validateValue(o.val, o.rules);
    if ((o.val + "").length && notValid) {
        o.e.preventDefault();
    }
}, _FieldBinder_maxHandler = function _FieldBinder_maxHandler(o) {
    const notValid = !validateValue(o.val, o.rules);
    if ((o.val + "").length && notValid) {
        o.e.preventDefault();
        if (o.field && o.limit && "value" in o.field) {
            o.field.value = String(o.limit || "") || String(o.val);
        }
    }
};
function getClipboardData(val) {
    if (val && "getData" in val && typeof val.getData === "function") {
        return val.getData("text");
    }
    return "";
}
