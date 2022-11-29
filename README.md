# @dspot/eslint-plugin

Enforces project practices

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@dspot/eslint-plugin`:

```sh
npm install @dspot/eslint-plugin@https://github.com/DSpotDevelopers/dspot-eslint-plugin --save-dev

//If using yarn
yarn add -D @dspot/eslint-plugin@https://github.com/DSpotDevelopers/dspot-eslint-plugin
```

## Usage

Add `@dspot/eslint-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@dspot/eslint-plugin"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@dspot/rule-name": "error"
    }
}
```

## Supported Rules

| Name                                                                                           | Description                                                                                           |
|:-----------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------|
| [no-business-in-controller](docs/rules/no-business-in-controller.md)                           | disallow usage of business logic in Controllers (NestJS)                                              |
| [no-complex-logic-in-view-attributes](docs/rules/no-complex-logic-in-view-attributes.md)       | disallow using complex expressions in attributes of elements inside Functional Components for "Views" |
| [no-method-declaration-in-view](docs/rules/no-method-declaration-in-view.md)                   | disallow declaring functions within Functional Components for "Views"                                 |
| [no-prop-object-from-custom-hook-spread](docs/rules/no-prop-object-from-custom-hook-spread.md) | disallow to use Spread for Prop objects from custom hooks (ie. View Models)                           |
| [no-react-hooks-in-view](docs/rules/no-react-hooks-in-view.md)                                 | disallow to use React Hooks in Functional Components for "Views"                                      |
| [require-props-object](docs/rules/require-props-object.md)                                     | disallow to use multiple properties when assigning to a single Element                                |
