/**
 * @fileoverview Detects the use of methods in views, which should be moved to a logic layer (a Hook)
 * @author Adrian Rivero
 */
"use strict";

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/no-method-declaration-in-view");

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

ruleTester.run("no-method-declaration-in-view", rule, {
  valid: [
    {
      code: `
          export default function SomeView() {
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
    }
  ],

  invalid: [
    {
      code: `
          export default function SomeView() {
              function someMethod() {}
    
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
      errors: [{message: "Function declarations are not allowed in functional components"}]
    },
    {
      code: `
          export default function SomeView() {
              const someMethod = () => {}
              let someMethod2 = function() {}
    
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
      errors: [
          {message: "Function declarations are not allowed in functional components"},
          {message: "Function declarations are not allowed in functional components"}
      ]
    }
  ],
});
