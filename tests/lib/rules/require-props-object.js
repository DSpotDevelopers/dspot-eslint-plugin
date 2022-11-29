/**
 * @fileoverview Enforces that when passing more than one parameter from a Custom Hook to a view, they should be packed into a &#34;Props&#34; object (which should be then access per each attribute)
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/require-props-object");

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

ruleTester.run("require-props-object", rule, {
  valid: [
    {
      code: `
          export default function SomeView() {
              const {value1, value2} = useSomeView();
              return (
                <div>
                  <Button disabled={value1}></Button>
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
              const {value1, value2} = notAHook();
              return (
                  <Button 
                    text={value1}
                    disabled={value2}>
                  </Button>
              );
          }`
    }
  ],

  invalid: [
    {
      code: `
          export default function SomeView() {
              const {value1, value2} = useSomeView();
              return (
                  <Button 
                    text={value1}
                    disabled={value2}>
                  </Button>
              );
          }`,
      errors: [{ message: "Multiple properties should be packed in a Props object"}],
    },
  ],
});
