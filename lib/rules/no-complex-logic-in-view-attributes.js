/**
 * @fileoverview Detects complex logic on React Views
 * @author Adrian Rivero
 */
"use strict";

const { ESLintUtils } = require('@typescript-eslint/utils');
const createRule = ESLintUtils.RuleCreator(
  name => `https://github.com/DSpotDevelopers/dspot-eslint-plugin/blob/master/docs/rules/${name}.md`,
);

const { captureFunctionalComponent } = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule = {
  create(context) {
    let functionalComponent = null;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    const convertCamelCaseToNormal = (str) => {
        return str.replace(/([A-Z])/g, ' $1').trim();
    }

    const checkUnaryExpression = (node, expression) => {
      const validOperators = ["+", "-", "!"];

      //Some Unary Expressions are permitted
      if (expression.type === "UnaryExpression" && validOperators.includes(expression.operator)) {
        return checkForComplexLogicInAttributes(node, expression.argument, false);
      }

      return false;
    }

    const checkObjectExpression = (node, expression) => {
      //Allow object expressions only if their properties are simple or nested object expressions (which should be checked recursively)
      if (expression.type === "ObjectExpression") {
        return expression.properties.every(property => {
          if (property.type === "Property") {
            return checkForComplexLogicInAttributes(node, property.value, false);
          }

          return false;
        });
      }

      return false;
    }

    const checkCallExpression = (node, expression) => {
      //Allow CallExpressions only if the attribute is "className" and the expression is a call to classNames()
      if (expression.type === "CallExpression" && node.parent.name.name === "className") {
        const callee = expression.callee;
        if (callee.type === "Identifier" && callee.name === "classNames") {
          return true;
        }
      }

      return false;
    }

    const checkArrowFunctionExpression = (node, expression) => {
      if (expression.type === "ArrowFunctionExpression") {
        //Allow CallExpressions in ArrowFunctionExpressions only if the arguments are simple expressions
        //and break if any is not simple
        if (expression.body.type === "CallExpression") {
          return expression.body.arguments.every(argument => {
            //The argument could be a simple spread element
            if (argument.type === "SpreadElement") {
              return checkForComplexLogicInAttributes(node, argument.argument, false);
            }

            return checkForComplexLogicInAttributes(node, argument, false)
          });
        }

        //Allow ArrowFunctionExpressions only if their body is a simple expression
        return checkForComplexLogicInAttributes(node, expression.body, false);
      }

      return false;
    }

    const checkChainExpression = (node, expression) => {
      //Allow ChainExpressions only if it is a simple expression
      if (expression.type === "ChainExpression") {
        return checkForComplexLogicInAttributes(node, expression.expression, false);
      }

      return false;
    }

    const checkArrayExpression = (node, expression) => {
      //Allow ArrayExpressions only if they are simple expressions
      if (expression.type === "ArrayExpression") {
        return expression.elements.every(element => {
          return checkForComplexLogicInAttributes(node, element, false);
        });
      }

      return false;
    }

    const checkTemplateLiteral = (node, expression) => {
      //Allow TemplateLiterals only if they are simple expressions
      if (expression.type === "TemplateLiteral") {
        return expression.expressions.every(element => {
          return checkForComplexLogicInAttributes(node, element, false);
        });
      }

      return false;
    }

    const checkForConditionalExpression = (node, expression) => {
      //Allow ConditionalExpressions only if they are simple expressions
      if (expression.type === "ConditionalExpression") {
        return checkForComplexLogicInAttributes(node, expression.test, false) &&
          checkForComplexLogicInAttributes(node, expression.consequent, false) &&
          checkForComplexLogicInAttributes(node, expression.alternate, false);
      }

      return false;
    }

    const checkForComplexLogicInAttributes = (node, expression, report = true) => {
        const permittedExpressions = [
            "Literal",
            "Identifier",
            "JSXElement",
            "JSXFragment",
            "MemberExpression"
        ];
        if (permittedExpressions.includes(expression.type)) {
            return true;
        }

        const allChecks = [
            checkUnaryExpression,
            checkObjectExpression,
            checkCallExpression,
            checkArrowFunctionExpression,
            checkChainExpression,
            checkArrayExpression,
            checkForConditionalExpression,
            checkTemplateLiteral
        ];

        if (allChecks.some(check => check(node, expression))) {
            return true;
        }

        if (report) {
          context.report({
            node,
            message: "Complex {{expression}} is not permitted in view attributes",
            data: {
              expression: convertCamelCaseToNormal(expression.type)
            }
          });
        }

        return false;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    //Note: Use playground to explore AST at https://typescript-eslint.io/play/#showAST=es
    return {
        //Find if default declaration is a functional component
        "ExportDefaultDeclaration > FunctionDeclaration"(node) {
            functionalComponent = captureFunctionalComponent(node);
        },

        "JSXAttribute > JSXExpressionContainer"(node) {
          if (!functionalComponent) {
              return;
          }

          const expression = node.expression;
          checkForComplexLogicInAttributes(node, expression);
        },

        "JSXSpreadAttribute"(node) {
            if (!functionalComponent) {
                return;
            }

            //Allow spread attributes only for Identifier and MemberExpression
            const expression = node.argument;
            if (expression.type !== "Identifier" && expression.type !== "MemberExpression") {
                context.report({
                    node,
                    message: "Complex {{expression}} is not permitted in spread attributes",
                    data: {
                        expression: convertCamelCaseToNormal(expression.type)
                    }
                });
            }
        }
    };
  },

  name: "no-complex-logic-in-view-attributes",
  meta: {
    type: `suggestion`,
    docs: {
      description: "Complex logic shouldn't be written in Views",
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
