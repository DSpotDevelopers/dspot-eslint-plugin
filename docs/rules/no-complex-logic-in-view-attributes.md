# Detects complex logic on React Views (no-complex-logic-in-view-attributes)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

export default function SomeView() {
  return (
    <>
      <Button {...value()}></Button>
      <Button disabled={value1 && value2}></Button>
      <Button disabled={!(value1 && value2)}></Button>
      <Button disabled={condition? value1() : value2}></Button>
      <Button disabled={someMethod(value1, value2)}></Button>
      
      <Button someAttribute={{ property1: true, complexProperty: someFunction() }}></Button>
      <Button onPress={value1?.property()}></Button>
      <Button onPress={[value1, value2(), value3 + value4]}></Button>
      <Button onPress={`Hello ${value1 + value2}`}></Button>
      
      <Button onPress={() => {
        console.log('Hello');
        console.log('World');
      }}></Button>
    </>
  );
}

```

Examples of **correct** code for this rule:

```js

export default function SomeView() {
  return (
    <>
      <Button disabled={value1}></Button>
      <Button disabled={!value1}></Button>
      <Button disabled={!!value1}></Button>
      <Button {...value}></Button>
      <Button {...value.property}></Button>
      <Button onPress={value1?.property}></Button>
      <Button onPress={[value1]}></Button>
      
      <Button onPress={`Hello${value1}`}></Button>
      <Button disabled={condition? value1 : value2}></Button>
      <Button style={{ display: 'flex', width: 'auto', height: -8, justifyContent: 'center' }}></Button>
      <Button onPress={() => console.log('Hello')}></Button>
      
      //Exception when using classNames
      <div className={classNames(styles.name, condition && styles.disabled)}>Some Text</div>
    </>
  );
}

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
