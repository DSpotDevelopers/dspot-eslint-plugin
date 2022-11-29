/**
 * @fileoverview Enforces that when passing more than one parameter from a Custom Hook to a view, they should be packed into a "Props" object (which should be then access per each attribute)
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
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Enforces that when passing more than one parameter from a Custom Hook to a view, they should be packed into a \"Props\" object (which should be then access per each attribute)",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },
  name: "require-props-object",
  defaultOptions: [],

  create(context) {
    let properties = [];
    let data = {
      functionalComponent: undefined,
    };

    return {
      ...captureFunctionalComponent(data),

      //Capture all the properties destructured from the Custom Hook
      "VariableDeclarator > ObjectPattern"(node) {
        if (!data.functionalComponent) {
          return;
        }

        //Ensure the initialization is done from within the Custom Hook (which should start with "use")
        const init = node.parent.init;
        if (init.type !== "CallExpression" || init.callee.type !== "Identifier" || !init.callee.name.startsWith("use")) {
          return;
        }

        properties = node.properties.map(property => property.key.name);
      },

      //Check if there's more than one property being used on any JSXElement
      "JSXElement"(node) {
        if (!data.functionalComponent) {
          return;
        }

        //There shouldn't be more than 2 properties being used in Expression Containers assigned to the attributes
        const expressionContainers = node.openingElement.attributes
          .filter(
            attribute => attribute.type === "JSXAttribute"
              && attribute.value && attribute.value.type === "JSXExpressionContainer"
          )
          .map(attribute => attribute.value.expression);

        let usedProperties = expressionContainers
          .filter(expression => expression.type === "Identifier" || expression.type === "MemberExpression")
          .map(expression => expression.type === "Identifier" ? expression.name : expression.object.name)
          .filter(name => properties.includes(name));

        //Remove duplicates
        usedProperties = [...new Set(usedProperties)];

        if (usedProperties.length > 1) {
          context.report({
            node,
            message: "Multiple properties should be packed in a Props object"
          });
        }
      }
    };
  },
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = createRule(rule);
