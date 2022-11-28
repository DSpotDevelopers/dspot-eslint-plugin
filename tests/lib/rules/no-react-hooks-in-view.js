/**
 * @fileoverview Detects the usage of React Hooks within Functional Components
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/no-react-hooks-in-view");

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

ruleTester.run("no-react-hooks-in-view", rule, {
  valid: [
    {
      code: `
          export default function SomeView() {
              const [value1, setValue1] = anyMethod();
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
    },
    {
      code: `
          export default function SomeView() {
              const {value1} = useSomething();
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
    }
  ],

  invalid: [
    {
      code: `
          export default function SomeView() {
              const [value1, setValue1] = useState(0);
    
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
      errors: [{message: "React Hook useState is not allowed in functional components"}]
    },
    {
      code: `
          export default function SomeView() {
              useEffect(() => {}, []);
    
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
      errors: [{message: "React Hook useEffect is not allowed in functional components"}]
    },
    {
      code: `
          export default function SomeView() {
              useLayoutEffect(() => {
                    console.log("Hello");
              }, []);
    
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
      errors: [{message: "React Hook useLayoutEffect is not allowed in functional components"}]
    }
  ],
});
