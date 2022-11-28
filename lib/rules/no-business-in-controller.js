/**
 * @fileoverview Business Logic shouldn't be written on controller
 * @author Adrian Rivero
 */
"use strict";

const { ESLintUtils, AST_NODE_TYPES } = require('@typescript-eslint/utils');
const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
);

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule = {
  create(context) {
    // variables should be defined here
    let visitingController = false;
    let injectedDependencies = [];
    let dependenciesMethodsCalled = [];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    //Note: Use playground to explore AST at https://typescript-eslint.io/play/#showAST=es
    return {

      ClassDeclaration(node) {
        if (node.id.name.endsWith("Controller")) {
          visitingController = true;
        }
      },

      //Inject dependencies from the constructor
      "MethodDefinition[kind='constructor'][value.params.length > 0]"(node) {
        if (!visitingController) {
          return;
        }

        let parameters = node.value.params;
        injectedDependencies = parameters.map(parameter => parameter.parameter.name);
      },

      //Detect call expressions in the form "this.someIdentifier.someMethod()"
      "CallExpression > MemberExpression[object.object.type='ThisExpression'][property.type='Identifier']"(node) {
        if (!visitingController) {
          return;
        }

        let dependency = node.object.property.name;
        if (injectedDependencies.includes(dependency)) {
          //Don't permit more than 2 dependencies calls
          if (dependenciesMethodsCalled.length > 0) {
            context.report({
              node,
              message: "Only permitted one dependency method call per controller method",
            });
          }

          dependenciesMethodsCalled.push(node);
        }
      },

      "MethodDefinition[kind!='constructor']"(node) {
        if (!visitingController) {
          return;
        }

        //Reset dependencies calls
        dependenciesMethodsCalled = [];
      }
    };
  },

  name: "no-business-in-controller",
  meta: {
    type: `suggestion`,
    docs: {
      description: "Business Logic shouldn't be written on controller",
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
