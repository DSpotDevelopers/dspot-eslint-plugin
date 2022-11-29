# Detects the use of methods in views, which should be moved to a logic layer (a Hook) (no-method-declaration-in-view)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

export default function SomeView() {
  function someMethod() {}

  const someMethod = () => {}
  
  let someMethod2 = function() {}
  
  return (
    <Button disabled={value1}></Button>
  );
}

```

Examples of **correct** code for this rule:

```js

export default function SomeView() {
  return (
    <Button disabled={value1}></Button>
  );
}

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
