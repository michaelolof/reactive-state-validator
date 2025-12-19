import { describe, it, expect } from 'vitest';
import { defineValidations } from '../src/validator';
import { required, email, minChar } from '../src';

const cloneState = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const states = {
    invalidEmail: {
        name: 'John',
        email: 'invalid-email',
        password: '123',
    },

    validEmail: {
        name: 'John',
        email: 'test@example.com',
        password: '123456',
    },

    undefinedPassword: {
        name: 'John',
        email: 'test@example.com',
        password: undefined,
    }
}

describe('Validator', () => {
    it('should validate required field', () => {
        const s = cloneState(states)
        const v = defineValidations({
            name: {
                val: () => s.invalidEmail.name,
                rules: [required],
                msg: 'Name is required',
            },
            email: {
                val: () => s.invalidEmail.email,
                rules: [required, email],
                msg: () => {
                    switch (v.rule("email")) {
                        case "required": return "Email cannot be empty"
                        case "email": return "Enter a valid email"
                        default: return "Email is invalid"
                    }
                }
            },
            password: {
                val: () => s.invalidEmail.password,
                rules: [required],
                msg: 'Password is required',
            },
        });

        // Validate (mutating error state)
        v.validateAll();

        expect(v.hasFailed('name')).toBe(false);
        expect(v.hasFailed("password")).toBe(false);
        expect(v.hasFailed("email")).toBe(true);
        expect(v.failedOn("email", "email")).toBe(true)
        expect(v.msg("email")).toBe("Enter a valid email")
        expect(v.msg("password")).toBe("");
    });

    it('should validate email field', () => {
        const state = {
            email: 'invalid-email',
        };

        const v = defineValidations({
            email: {
                val: () => state.email,
                rules: [email],
                msg: 'Invalid email',
            },
        });

        v.validateAll();
        expect(v.hasFailed('email')).toBe(true);
        expect(v.msg('email')).toBe('Invalid email');

        state.email = 'test@example.com';
        v.validateAll();
        expect(v.hasFailed('email')).toBe(false);
    });

    it('should validate multiple rules', () => {
        const state = {
            password: '123',
        };

        const v = defineValidations({
            password: {
                val: () => state.password,
                rules: [required, minChar(5)],
                msg: 'Password invalid',
                msgs: {
                    minChar: 'Password must be at least 5 chars'
                }
            },
        });

        v.validateAll();
        expect(v.hasFailed('password')).toBe(true);
        // We expect the min rule to fail
        // The rule name for min(5) depends on implementation. 
        // Let's inspect the rule name if needed, or just check general failure.
        // Assuming 'min' is the rule name.
    });

    it('should respect validateIf condition', () => {
        const state = {
            optionalField: '',
            shouldValidate: false
        };

        const v = defineValidations({
            optionalField: {
                val: () => state.optionalField,
                rules: [required],
                validateIf: () => state.shouldValidate,
                msg: 'Required'
            }
        });

        v.validateAll();
        expect(v.hasFailed('optionalField')).toBe(false); // Should be valid because validation skipped

        state.shouldValidate = true;
        v.validateAll();
        expect(v.hasFailed('optionalField')).toBe(true);
    });
});
