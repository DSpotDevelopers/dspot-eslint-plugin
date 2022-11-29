# Business Logic shouldn&#39;t be written on controller (no-business-in-controller)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
class SomeController {
    constructor(private readonly someService: SomeService) {}

    async someMethod() {
      this.someService.someMethod1(),
      this.someService.someMethod2()
    }
}
```

Examples of **correct** code for this rule:

```js
class SomeController {
    constructor(private readonly someService: SomeService) {}

    async someMethod() {
      return this.someService.someMethod()
    }
}
```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
