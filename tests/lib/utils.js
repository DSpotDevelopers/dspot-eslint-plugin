/**
 * @fileoverview Detects complex logic on React Views
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const createRule = ESLintUtils.RuleCreator(
  name => `https://${name}`,
);

const {captureFunctionalComponent} = require("../../lib/utils");

const rule = createRule({
  meta: {
    type: null,
    docs: {
      description: "Utils Test",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [],
  },
  name: "utils-test",
  defaultOptions: [],

  create(context) {
    let data = {
      functionalComponent: undefined,
    };

    return {
      ...captureFunctionalComponent(data),

      "Program:exit"(node) {
        if (data.functionalComponent) {
          context.report({
            node,
            message: "Functional component found",
          });
        } else {
          context.report({
            node,
            message: "Functional component not found",
          });
        }
      }
    };
  },
});


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

ruleTester.run("utils-test", rule, {
  valid: [
  ],
  invalid: [
    {
      code: `
          export const SomeView = function () {
              return (
                  <Button></Button>
              );
          }`,
      errors: [{message: "Functional component found"}]
    },
    {
      code: `
          export const SomeView = () => {
              return (
                  <Button></Button>
              );
          }`,
      errors: [{message: "Functional component found"}]
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
      errors: [{message: "Functional component found"}]
    },
    {
      code: `
            export default function SomeView() {
                return {something};
            }`,
      errors: [{message: "Functional component not found"}]
    }
  ],
});
