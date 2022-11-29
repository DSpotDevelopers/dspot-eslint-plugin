/**
 * @fileoverview Forces to independently assign a value to each attribute of a Prop object
 * @author Adrian Rivero
 */
"use strict";

const { ESLintUtils } = require('@typescript-eslint/utils');
const {captureFunctionalComponent} = require("../utils");
const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Forces to independently assign a value to each attribute of a Prop object",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },
  name: "no-prop-object-from-custom-hook-spread",
  defaultOptions: [],

  create(context) {
    let functionalComponent = null;
    let properties = [];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    //Note: Use playground to explore AST at https://typescript-eslint.io/play/#showAST=es
    return {
      //Find if default declaration is a functional component
      "ExportDefaultDeclaration > FunctionDeclaration"(node) {
        functionalComponent = captureFunctionalComponent(node);
      },

      //Capture all the properties destructured from the Custom Hook
      "VariableDeclarator > ObjectPattern"(node) {
        if (!functionalComponent) {
          return;
        }

        //Ensure the initialization is done from within the Custom Hook (which should start with "use")
        const init = node.parent.init;
        if (init.type !== "CallExpression" || init.callee.type !== "Identifier" || !init.callee.name.startsWith("use")) {
          return;
        }

        properties = node.properties.map(property => property.key.name);
      },

      //Find all the Prop objects passed to a view using the spread operator
      "JSXOpeningElement > JSXSpreadAttribute"(node) {
        if (!functionalComponent) {
          return;
        }

        //Ensure the spread attribute is a Prop object
        const spread = node.argument;

        //Only permit Identifier and MemberExpression
        if (spread.type !== "Identifier" && spread.type !== "MemberExpression") {
          return;
        }

        //If it's an Identifier, ensure it's a property
        if (spread.type === "Identifier" && !properties.includes(spread.name)) {
          return;
        }

        //If it's a MemberExpression, ensure it's a property
        if (spread.type === "MemberExpression" && !properties.includes(spread.object.name)) {
          return;
        }

        //Permit only spread of MemberExpressions where property is "validation"
        if (spread.type === "MemberExpression" && spread.property.name === "validation") {
          return;
        }

        //Report the spread attribute
        context.report({
          node,
          message: "Do not spread a Prop object from a Custom Hook (only valid for validation fields)",
        });
      }
    };
  },
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = createRule(rule);
