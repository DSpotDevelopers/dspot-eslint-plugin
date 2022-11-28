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

* Fill in provided rules here


