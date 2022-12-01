/**
 * @fileoverview On every unit test, there should be comments with Given, When, Then
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/require-given-when-then");

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

ruleTester.run("require-given-when-then", rule, {
  valid: [
    {
      code: `
        it('should test something', () => {
          // Given something initialized
          let { tab } = store.getState().profile;
    
          // When something happens
          store.dispatch(setTab('label'));
    
          // Then something should happen
          expect(tab).toBe('label');
        })`
    }
  ],

  invalid: [
    {
      code: `
        it('should test something', () => {
          // Given something
          let { tab } = store.getState().profile;
    
          // When something happens
          store.dispatch(setTab('label'));
    
          // Then something should happen
          expect(tab).toBe('label');
        })`,
      errors: [{message: "Comment should have at least 3 words"}]
    },
    {
      code: `
        it('should test something', () => {
          // When something happens
          let { tab } = store.getState().profile;
    
          // Given something happens
          store.dispatch(setTab('label'));
    
          // Then something should happen
          expect(tab).toBe('label');
        })`,
      errors: [{message: "Comments should have Given, When, Then in that order"}]
    },
    {
      code: `
        it('should test something', () => {
          let { tab } = store.getState().profile;
    
          store.dispatch(setTab('label'));
    
          expect(tab).toBe('label');
        })`,
      errors: [{message: "On every unit test, there should be comments with Given, When, Then"}]
    }
  ],
});
