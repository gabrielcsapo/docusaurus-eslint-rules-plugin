---
sidebar_position: 1
---

# Getting started

Let's discover how to install and configure `docusaurus-plugin-image-zoom`

## Installation

```shell
npm install docusaurus-plugin-image-zoom --save
```

## Configuration

:::info
You must define a path to your rules for most eslint-plugins this would be `lib/rules` but must be the absolute path to that
:::

```js title=docusaurus.config.js
{
  plugins: [
    "docusaurus-plugin-eslint-rules",
    {
      rulePath: path.resolve(".."),
    },
  ];
}
```

## Options

- rulePath(required): the path to your rules
- linkPath(optional): the path link the rule to the markdown file that you are rendering

## Setup

Please create the mdx file where you would like the `RulesTable` component to be rendered.

```mdx title="docs/rules.mdx"
import RulesTable from "docusaurus-plugin-eslint-rules/src/theme/RulesTable";

# Rules

<RulesTable />
```

Once you have done that all you need to do is create a navbar item to show that page to your users

```js title=docusaurus.config.js
{
  themeConfig: {
    navbar: {
      ...
      items: [
        ...
        { to: "/docs/rules", label: "Rules", position: "left" },
      ]
    }
  }
}
```
