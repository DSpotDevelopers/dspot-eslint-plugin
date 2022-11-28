/**
 * @fileoverview Business Logic shouldn&#39;t be written on controller
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/no-business-in-controller");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run("no-business-in-controller", rule, {
  valid: [
    {
      code: //Any method in controller should have only one call expression
        `export class SomeController {
          constructor(private readonly someService: SomeService) {}
          async someMethod() {
            return this.someService.someMethod()
          }
        }`
    }
  ],

  invalid: [
    {
      code:
        `export class SomeController {
          constructor(private readonly someService: SomeService) {}
          async someMethod() {
            this.someService.someMethod()
            this.someService.someMethod2()
          }
        }`,
      errors: [{
        message: "Only permitted one dependency method call per controller method"
      }]
    }
  ],
});
