/**
 * @fileoverview Detects complex logic on React Views
 * @author Adrian Rivero
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { ESLintUtils } = require('@typescript-eslint/utils');
const rule = require("../../../lib/rules/no-complex-logic-in-view-attributes");

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

ruleTester.run("no-complex-logic-in-view-attributes", rule, {
  valid: [
    {
      //Simple Identifier are allowed in attributes
      code: `
          export default function SomeView() {
              return (
                  <Button disabled={value1}></Button>
              );
          }`,
    },
    {
      //Simple Conditional expression are allowed in attributes
      code: `
          export default function SomeView() {
              return (
                  <Button disabled={condition? value1 : value2}></Button>
              );
          }`,
    },
    {
        //JSXExpressionContainer are allowed
        code: `
            export default function SomeView({condition}) {
                return (
                    <>
                      {condition ? (<Button disabled={value1}></Button>) : (<Button disabled={value2}></Button>)}
                    </>
                );
            }`,
    },
    {
        //Simple Object Expression are allowed
        code: `
            export default function SomeView() {
                return (
                    <Button style={{ display: 'flex', width: 'auto', height: -8, justifyContent: 'center' }}></Button>
                );
            }`
    },
    {
        //A call expression is allowed if the attribute is "className" and the expression is a call to classNames()
        code: `
            export default function SomeView() {
                return (
                    <div className={classNames(styles.name, condition && styles.disabled)}>Some Text</div>
                );
            }`
    },
    {
        //Unitary expressions are allowed
        code: `
            export default function SomeView() {
                return (
                    <Button disabled={!value1}></Button>
                );
            }`
    },
    {
      //Simple expressions inside a unary expression are allowed
      code: `
            export default function SomeView() {
                return (
                    <Button disabled={!!value1}></Button>
                );
            }`
    },
    {
      //Spread attributes are allowed
      code: `
        export default function SomeView() {
            return (
                <Button {...value}></Button>
            );
        }`
    },
    {
      //Spread member expressions are allowed
      code: `
        export default function SomeView() {
            return (
                <Button {...value.property}></Button>
            );
        }`
    },
    {
      //Simple Arrow functions are allowed
      //(TODO this should be fine when the method / member is a Props, ie. calling console.log is wrong in principle, hard to test)
      code: `
        export default function SomeView() {
            return (
                <Button onPress={() => console.log('Hello')}></Button>
            );
        }`
    },
    {
      //Simple Arrow Functions where methods have spread simple attributes are allowed
      //(TODO this should be fine when the method / member is a Props, ie. calling console.log is wrong in principle, hard to test)
      code: `
        export default function SomeView() {
            return (
                <Button onPress={() => console.log('Hello', ...value)}></Button>
            );
        }`
    },
    {
      //Simple Chain Expressions are allowed
      code: `
        export default function SomeView() {
            return (
                <Button onPress={value1?.property}></Button>
            );
        }`
    },
    {
      //Simple Array Expressions are allowed
      code: `
        export default function SomeView() {
            return (
                <Button onPress={[value1]}></Button>
            );
        }`
    },
    {
      //Simple Template Literals are allowed
      code: `
        export default function SomeView() {
            return (
                <Button onPress={\`Hello\${value1}\`}></Button>
            );
        }`
    }
  ],

  invalid: [
    {
        //Complex Conditional expression are not allowed in attributes
        code: `
            export default function SomeView() {
                return (
                    <Button disabled={condition? value1() : value2}></Button>
                );
            }`,
        errors: [{ message: "Complex Conditional Expression is not permitted in view attributes"}],
    },
    {
        //Logical expressions are not allowed in attributes
        code: `
            export default function SomeView() {
                return (
                    <Button disabled={value1 && value2}></Button>
                );
            }`,
        errors: [{ message: "Complex Logical Expression is not permitted in view attributes"}],
    },
    {
        //Method calls are not allowed in attributes
        code: `
            export default function SomeView() {
                return (
                    <Button disabled={someMethod(value1, value2)}></Button>
                );
            }`,
        errors: [{ message: "Complex Call Expression is not permitted in view attributes"}],
    },
    {
        //Object expressions are if they contain complex logic in properties
        code: `
            export default function SomeView() {
                return (
                    <Button someAttribute={{ property1: true, complexProperty: someFunction() }}></Button>
                );
            }`,
        errors: [{ message: "Complex Object Expression is not permitted in view attributes"}],
    },
    {
        //Complex expressions are not allowed in attributes with unary expressions
        code: `
            export default function SomeView() {
                return (
                    <Button disabled={!(value1 && value2)}></Button>
                );
            }`,
        errors: [{ message: "Complex Unary Expression is not permitted in view attributes"}],
    },
    {
        //Complex expressions are not allowed in spread attributes
        code: `
            export default function SomeView() {
                return (
                    <Button {...value()}></Button>
                );
            }`,
        errors: [{ message: "Complex Call Expression is not permitted in spread attributes"}],
    },
    {
      //Complex arrow functions are not allowed in attributes
      code: `
        export default function SomeView() {
            return (
                <Button onPress={() => {
                  console.log('Hello');
                  console.log('World');
                }}></Button>
            );
        }`,
      errors: [{ message: "Complex Arrow Function Expression is not permitted in view attributes"}],
    },
    {
      //Complex chain expressions are not allowed in attributes
      code: `
        export default function SomeView() {
            return (
                <Button onPress={value1?.property()}></Button>
            );
        }`,
      errors: [{ message: "Complex Chain Expression is not permitted in view attributes"}],
    },
    {
      //Complex array expressions are not allowed in attributes
      code: `
        export default function SomeView() {
            return (
                <Button onPress={[value1, value2(), value3 + value4]}></Button>
            );
        }`,
      errors: [{ message: "Complex Array Expression is not permitted in view attributes"}],
    },
    {
      //Complex template literals are not allowed in attributes
      code: `
        export default function SomeView() {
            return (
                <Button onPress={\`Hello \${value1 + value2}\`}></Button>
            );
        }`,
      errors: [{ message: "Complex Template Literal is not permitted in view attributes"}],
    }
  ],
});
