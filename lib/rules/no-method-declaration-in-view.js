/**
 * @fileoverview Detects the use of methods in views, which should be moved to a logic layer (a Hook)
 * @author Adrian Rivero
 */
"use strict";

const { ESLintUtils } = require('@typescript-eslint/utils');
const {captureFunctionalComponent} = require("../utils");
const createRule = ESLintUtils.RuleCreator(
  name => `https://github.com/DSpotDevelopers/dspot-eslint-plugin/blob/master/docs/rules/${name}.md`,
);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule = {
  create(context) {
    let data = {
      functionalComponent: undefined,
    };

    return {
      ...captureFunctionalComponent(data),

      "FunctionDeclaration"(node) {
        if (!data.functionalComponent) {
          return;
        }

        //Don't permit function declarations in functional components
        context.report({
            node,
            message: "Function declarations are not allowed in functional components",
        });
      },

      "VariableDeclaration"(node) {
        if (!data.functionalComponent) {
          return;
        }

        //Don't permit variable declarations of type functions in functional components
        const functionVariable = node.declarations.find(
            declaration => declaration.init &&
                (declaration.init.type === "FunctionExpression" || declaration.init.type === "ArrowFunctionExpression")
        );
        if (functionVariable) {
            context.report({
                node,
                message: "Function declarations are not allowed in functional components",
            });
        }
      }
    };
  },

  name: "no-method-declaration-in-view",
  meta: {
    type: `suggestion`,
    docs: {
      description: "Detects the use of methods in views, which should be moved to a logic layer (a Hook)",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },
  defaultOptions: []
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = createRule(rule);
