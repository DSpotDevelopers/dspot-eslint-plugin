# Forces to independently assign a value to each attribute of a Prop object (no-prop-object-from-custom-hook-spread)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

export default function SomeView() {
  const {buttonProps} = useSomeView();
  return (
    <div>
      <Button {...buttonProps}></Button>
      <Button {...buttonProps.property}></Button>
    </div>
  );
}

```

Examples of **correct** code for this rule:

```js

export default function SomeView() {
  const {buttonProps} = useSomeView();
  return (
    <div>
      <Button
        text={buttonProps.text}
        disabled={buttonProps.disabled}>
      </Button>

      //Validation field is an exception
      <Button {...buttonProps.validation}>
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
