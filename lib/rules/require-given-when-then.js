/**
 * @fileoverview On every unit test, there should be comments with Given, When, Then
 * @author Adrian Rivero
 */
"use strict";

const { ESLintUtils } = require('@typescript-eslint/utils');
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
      description: "On every unit test, there should be comments with Given, When, Then",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },
  name: "require-given-when-then",
  defaultOptions: [],

  create(context) {
    function ensureCommentHasAtLeast3Words(comment) {
      const words = comment.value.trim().split(" ");
      if (words.length < 3) {
          context.report({
              node: comment,
              message: "Comment should have at least 3 words"
          });
      }
    }

    return {
        //Detect the "it" function
        "CallExpression[callee.name='it']"(node) {
            const body = node.arguments[1].body;

            //Ensure the body is a block statement
            if (body.type !== "BlockStatement") {
                return;
            }

            //Get all the comments from the source code which are inside the body of the "it" function
            const comments = context.getSourceCode().getAllComments()
              .filter(
                  comment => comment.loc.start.line > body.loc.start.line && comment.loc.end.line < body.loc.end.line
              );

            //Ensure there are at least 3 comments, and they start with Given, When, Then in that order
            const words = {
                Given: 0,
                When: 0,
                Then: 0,
            };

            for (const comment of comments) {
              const word = comment.value.trim().split(" ")[0];
              if (word in words) {
                  switch (word) {
                      case "Given":
                          words.Given++;
                          ensureCommentHasAtLeast3Words(comment);
                          break;
                      case "When":
                          if (words.Given > 0) {
                              words.When++;
                          } else {
                            context.report({
                                node: comment,
                                message: "Comments should have Given, When, Then in that order"
                            });
                            return;
                          }
                          ensureCommentHasAtLeast3Words(comment);
                          break;
                      case "Then":
                          if (words.When > 0) {
                              words.Then++;
                          } else {
                              context.report({
                                  node: comment,
                                  message: "Comments should have Given, When, Then in that order"
                              });
                              return;
                          }
                          ensureCommentHasAtLeast3Words(comment);
                          break;
                  }
              }
            }

            if (words.Given === 0 || words.When === 0 || words.Then === 0) {
              context.report({
                  node,
                  message: "On every unit test, there should be comments with Given, When, Then",
              });
            }
        }
    };
  },
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = createRule(rule);
