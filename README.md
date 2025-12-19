# Reactive State Validator

Reactive State Validator is a simple, fully typed, customizable reactive validator engine. It provides a flexible way to validate your state with built-in rules or custom logic.

## Installation

```bash
npm install reactive-state-validator
```

## Basic Usage
To use the validator, you define a set of validations for your reactive state. The `defineValidations` function returns an instance of a `Reporter` object that you can use to check validation status and retrieve error messages.

```typescript
import { defineValidations, required, email, minChar } from 'reactive-state-validator';

// 1. Define your reactive state
const state = {
  username: '',
  email: '',
  password: ''
};

// 2. Define validations
const vr = defineValidations({
  username: {
    // Return the value to be validated
    val: () => state.username,
    // Define rules
    rules: [required, minChar(3)],
    // Custom error message
    msg: () => 'Username is required and must be at least 3 characters.'
  },
  email: {
    val: () => state.email,
    rules: [required, email],
  },
  password: {
    val: () => state.password,
    rules: [required, minChar(8)],
    msg: () => {
      if (vr.failedOn('password', "required")) {
        return 'Password cannot be empty';
      }
      else if (vr.failedOn('password', "minChar")) {
        return 'Password must be at least 8 characters long.';
      }
      return 'Password is invalid';
    }
  }
});

// 3. Trigger validation (e.g., on submit)
function submit() {
  const isValid = vr.validateAll()
  if (!isValid) {
    console.log('Form has errors.');
    return;
  }

  console.log('Form is valid!');
}
```

### Displaying Errors

Use the `vr` reporter object in your template (here we're using a Vue template), you can report error messages in a few ways.

```html
<template>
  <div>
    <input v-model="state.username" placeholder="Username" @input="vr.clear('username')" @blur="vr.validate('username')" />
    <span v-if="vr.hasFailed('username')" class="error">
      {{ vr.msg('username') }}
    </span>

    <input v-model="state.email" placeholder="Email" @input="vr.clear('email')" @blur="vr.validate('email')" />
    <span v-if="vr.isEmpty('email')" class="error">
      Email cannot be empty
    </span>
    <span v-else-if="vr.hasFailed('email')" class="error">
      Enter a valid email address.
    </span>
    
    <button @click="submit">Submit</button>
  </div>
</template>
```

The `validateAll` function will validate all fields and mutate the internal error report object so you can display errors in your template. It returns a boolean indicating whether the form is valid.

In the template above, we're also performing an on-input and on-blur validation for each field. This can be useful for providing immediate feedback to the user.  

## Validation Rules

The package comes with a set of built-in rules:

| Rule | Description |
| :--- | :--- |
| **`alpha`** | Checks if the value contains only alphabetic characters. |
| **`alphaNumeric`** | Checks if the value contains only alphanumeric characters. |
| **`charRange(min, max)`** | Checks if the character count is within the specified range. |
| **`contains(value)`** | Checks if the input contains the specified value. |
| **`containsNumbers`** | Checks if the value contains at least one number. |
| **`decimal`** | Checks if the value is a valid decimal number. |
| **`email`** | Checks if the value is a valid email address. |
| **`equal(value)`** | Checks if the input equals the specified value. |
| **`integer`** | Checks if the value is a valid integer. |
| **`ipAddress`** | Checks if the value is a valid IP address. |
| **`macAddress`** | Checks if the value is a valid MAC address. |
| **`match(regex)`** | Checks if the value matches the provided regular expression. |
| **`matchLength(length)`** | Checks if the value has the exact specified length. |
| **`max(n)`** | Checks if the numeric value is at most `n`. |
| **`maxChar(n)`** | Checks if the string length is at most `n`. |
| **`maxWord(n)`** | Checks if the word count is at most `n`. |
| **`min(n)`** | Checks if the numeric value is at least `n`. |
| **`minChar(n)`** | Checks if the string length is at least `n`. |
| **`minWord(n)`** | Checks if the word count is at least `n`. |
| **`notContain(value)`** | Checks if the input does NOT contain the specified value. |
| **`numeric`** | Checks if the value is numeric. |
| **`range(min, max)`** | Checks if the numeric value is within the specified range. |
| **`required`** | Checks if the value is non-empty. |
| **`url`** | Checks if the value is a valid URL. |
| **`wordRange(min, max)`** | Checks if the word count is within the specified range. |

You can easily create your own validation rules. A rule is simply a function that takes a value and returns a `Validation` object. The `createRule` helper makes this even easier.

```typescript
import { createRule } from 'reactive-state-validator';

// Example: Check if value is "cool"
const beCool = createRule({
  name: 'beCool',
  rule: (value: any) => value === 'cool'
});

// Usage
const v = defineValidations({
  status: {
    val: () => state.status,
    rules: [beCool],
    msg: 'You must be cool.'
  }
});
```

You can check if a specific validation rule failed validation by using the `failedOn` method.

```typescript
const isValid = v.failedOn('status', 'beCool');
```

or in your template

```html
<span v-if="v.failedOn('status', 'beCool')" class="error">
  The status entered isn't cool enough.
</span>
```

## API Reference

### `defineValidations(options: ValidatorDefinition[])`

Initializes the validator with the provided definition.

*   `options`: An array of `ValidatorDefinition` objects.

### `ValidatorDefinition` Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| **`val`** | `() => any` | Function returning the value to validate. |
| **`rules`** | `Rule \| Rule[]` | Validation rule or array of validation rules. |
| **`msg`** | `string \| () => string` | Optional. Custom error message to display on failure. |
| **`validateIf`** | `boolean \| () => boolean` | Optional. Condition to determine if validation should run. |

### `Reporter` Methods

The object returned by `defineValidations` is an instance of `Reporter`.

| Method | Return Type | Description |
| :--- | :--- | :--- |
| **`validateAll()`** | `boolean` | Validates all fields and mutates the internal error state for reporting. Returns `true` if all valid. |
| **`validate(...names)`** | `boolean` | Validates specific fields and mutates the internal error state for reporting. |
| **`checkAll()`** | `boolean` | Validates all fields **without** mutating the internal error state. Useful for validation without side effects. |
| **`check(...names)`** | `boolean` | Validates specific fields **without** mutating the internal error state. |
| **`msg(name)`** | `string` | Returns the error message for the field if invalid. |
| **`hasFailed(name)`** | `boolean` | Returns `true` if the field failed validation. |
| **`failedOn(name, ...rules)`** | `boolean` | Returns `true` if the field failed because of one of the specified rules. |
| **`isEmpty(name)`** | `boolean` | Returns `true` if the field is empty (and required). |
| **`isWrong(name)`** | `boolean` | Returns `true` if the field is not empty but failed a rule. |
| **`rule(name)`** | `string \| undefined` | Returns the name of the failing rule, Returns `undefined` if the field is valid. |
| **`clear(...names)`** | `void` | Clears error state for specific fields. |
| **`clearAll()`** | `void` | Clears error state for all fields. |
| **`loadOptions(opts)`** | `void` | Re-initializes the validator with new options. |