# On every unit test, there should be comments with Given, When, Then (require-given-when-then)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js

it('should test something', () => {
    let { tab } = store.getState().profile;

    store.dispatch(setTab('label'));

    expect(tab).toBe('label');
})

//Very short comments
it('should test something', () => {
    // Given 
    let { tab } = store.getState().profile;

    // When short
    store.dispatch(setTab('label'));

    // Then short
    expect(tab).toBe('label');
})

//Not correct order of comments
it('should test something', () => {
    // When something happens
    let { tab } = store.getState().profile;

    // Given something happens
    store.dispatch(setTab('label'));

    // Then something should happen
    expect(tab).toBe('label');
})
```

Examples of **correct** code for this rule:

```js

it('should test something', () => {
    // Given something initialized
    let { tab } = store.getState().profile;

    // When something happens
    store.dispatch(setTab('label'));

    // Then something should happen
    expect(tab).toBe('label');
})

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
