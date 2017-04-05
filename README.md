# html-webpack-template-plugin

[![npm](https://nodei.co/npm/html-webpack-template-plugin.png?downloads=true)](https://www.npmjs.com/package/html-webpack-template-plugin)

[![travis](https://travis-ci.org/guox191/html-webpack-template-plugin.svg?branch=master)](https://travis-ci.org/guox191/html-webpack-template-plugin)

Simplifies creation of HTML files based on template and config file Edit.

In most MPA(Multi Page App) project, multi page modules share one context, common libraries etc, and under the same webpack build config. Also, every module own its `index.html` which include its resources with the awesome [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).

This plugin is an enhancement of `html-webpack-plugin`. Every module shares one common `index.html` template, plugin will help it generate its unique `index.html` by reading its template config.

### Installation
---
Instal the plugin with npm:

```
$ npm install html-webpack-template-plugin --save-dev
```

### Usage
---
First create template file and module config file.

Template file parsed by template engine like `handlebars` or `ejs`, which support two common template syntax `Mustache` and `Embedded JavaScript`.

`index.hds`
```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8">
  {{{metaTag meta}}}
  <title>{{title}}</title>
</head>
<body>
  {{#if body}}
  {{{body}}}
  {{else}}
  <div id="#app"></app>
  {{/if}}
  {{#each scripts}}
  <script src="{{this}}"></script>
  {{/each}}
</body>
</html>
```

As mentioned above, every module has own template config file. You can write it by `yaml`/`json`/`js`.

`{{module}}/index.yml`

```yaml
title: 'page2'
body: '<p>This is page2</p>'
stylesheets:
  - 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.7/semantic.min.js'
scripts:
  - 'https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js'
```

More examples under `/example` folder

```
const htmlWebpackPlugin = require('html-webpack-plugin')
const htmlTemplatePlugin = require('html-webpack-template-plugin')

var webpackConfig = {
  ...
  plugins: [
    ...
    // All modules htmlWebpackPlugin here
    new html-webpack-template-plugin({
      ...
    })
  ]
}
```

### Configuration
---
- `root`: project root path. Default to `process.cwd()`.
- `engine`: `handlebars`(default) | `ejs`.
- `template`: [required] template file location.
- `variable`: `Object` A map of predefined variables which will be injected into
template and can be overwrote by config file.
- `helper`: `Object` A map of view helpers which will be injected into
template and can be overwrote by config file.
- `filter`: `Function` A pure function which receives module config and html-webpack-plugin option, return the real config handled by view parser.

Extra options added in htmlWebpackPlugin:
- `disableTemplate`: `true` | `false`(default).
- `scriptAttribute`: `Object` A map of script attributes will be set

### Tips
---
- For boolean attribute, you can set `collapseBooleanAttributes: true` in `html-webpack-plugin` `minify` option to remove `true/false` value.

### License
---
This project is licensed under [MIT](https://github.com/guox191/html-webpack-template-plugin/blob/master/LICENSE).
