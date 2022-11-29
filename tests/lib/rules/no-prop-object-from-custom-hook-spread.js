/**
 * @fileoverview Forces to independently assign a value to each attribute of a Prop object
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/no-prop-object-from-custom-hook-spread");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true
    }
  }
});

ruleTester.run("no-prop-object-from-custom-hook-spread", rule, {
  valid: [
    {
      code: `
          export default function SomeView() {
              const {buttonProps, value2} = useSomeView();
              return (
                  <div>
                    <Button 
                      text={buttonProps.text}
                      disabled={buttonProps.disabled}>
                    </Button>
                    <Button disabled={value2}></Button>
                  </div>
              );
          }`,
    },
    {
      code: `
          export default function SomeView() {
              const {buttonProps, value2} = useSomeView();
              return (
                  <div>
                    <Button {...buttonProps.validation}>
                    </Button>
                    <Button disabled={value2}></Button>
                  </div>
              );
          }`
    }
  ],

  invalid: [
    {
      code: `
          export default function SomeView() {
              const {buttonProps, value2} = useSomeView();
              return (
                  <div>
                    <Button {...buttonProps}>
                    </Button>
                    <Button disabled={value2}></Button>
                  </div>
              );
          }`,
      errors: [{message: "Do not spread a Prop object from a Custom Hook (only valid for validation fields)"}]
    },
    {
      code: `
          export default function SomeView() {
              const {buttonProps, value2} = useSomeView();
              return (
                  <div>
                    <Button {...buttonProps.property}>
                    </Button>
                    <Button disabled={value2}></Button>
                  </div>
              );
          }`,
      errors: [{message: "Do not spread a Prop object from a Custom Hook (only valid for validation fields)"}]
    }
  ],
});
