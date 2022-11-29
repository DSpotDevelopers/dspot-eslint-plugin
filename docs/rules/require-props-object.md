# Enforces that when passing more than one parameter from a Custom Hook to a view, they should be packed into a &#34;Props&#34; object (which should be then access per each attribute) (require-props-object)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

export default function SomeView() {
  const {value1, value2} = useSomeView();
  return (
    <Button
      text={value1}
      disabled={value2}>
    </Button>
  );
}

```

Examples of **correct** code for this rule:

```js

export default function SomeView() {
  const {value1, value2} = useSomeView();
  return (
    <div>
      <Button disabled={value1}></Button>
      <Button disabled={value2}></Button>
    </div>
  );
}

export default function SomeView() {
  const {buttonProps} = useSomeView();
  return (
    <div>
      <Button
        text={buttonProps.text}
        disabled={buttonProps.disabled}>
      </Button>
    </div>
  );
}

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
