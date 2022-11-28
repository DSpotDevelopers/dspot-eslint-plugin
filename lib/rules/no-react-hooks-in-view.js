/**
 * @fileoverview Detects the usage of React Hooks within Functional Components
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
  create(context) {
    let functionalComponent = null;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    //Note: Use playground to explore AST at https://typescript-eslint.io/play/#showAST=es
    return {
      //Find if default declaration is a functional component
      "ExportDefaultDeclaration > FunctionDeclaration"(node) {
        functionalComponent = captureFunctionalComponent(node);
      },

      "CallExpression"(node) {
        if (!functionalComponent) {
          return;
        }

        //Don't permit calling main React Hooks
        const notAllowedHooks = [
          "useState",
          "useEffect",
          "useContext",
          "useReducer",
          "useCallback",
          "useMemo",
          "useRef",
          "useImperativeHandle",
          "useLayoutEffect",
          "useDebugValue",

          //React Form Hooks
          "useForm",
          "useFieldArray",
          "useController",
          "useWatch",
          "useFormContext",

          //React Redux Hooks
          "useSelector",
          "useDispatch",
          "useStore",

          //React Router Hooks
          "useHistory",
          "useLocation",
          "useParams",
          "useRouteMatch",

          //React Router Native Hooks
          "useLinkProps",
          "useNavigation",
          "useRoute",

          //React Storage Hooks
          "useLocalStorage",
          "useSessionStorage"

        ];
        if (notAllowedHooks.includes(node.callee.name)) {
            context.report({
                node,
                message: "React Hook {{hookName}} is not allowed in functional components",
                data: {
                    hookName: node.callee.name
                }
            });
        }
      }
    };
  },

  name: "no-react-hooks-in-view",
  meta: {
    type: `suggestion`,
    docs: {
      description: "Detects the usage of React Hooks within Functional Components",
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
