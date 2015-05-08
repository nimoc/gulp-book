# nsdeclare [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis]
> Safely declare a namespace using dot notation

## Usage

```js
var declare = require('nsdeclare');

var declaration = declare('MyApp.Templates');
```

Result:
```js
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};
```

## Options

Options can be passed as the second argument to `nsdeclare`.

### value
Type: `String`

By passing `options.value`, you can use `nsdeclare` to both declare and safely assign properties of a namespace:

```js
var declare = require('nsdeclare');

var declaration = declare('MyApp.Templates.Main', { value: 'function() { return "Main"; }' });
```

Result:
```js
this["MyApp"] = this["MyApp"] || {};
this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};
this["MyApp"]["Templates"]["Main"] = function() { return "Main"; };
```

### declared
Type: `Object`

To avoid redeclaration, you can pass a list of already declared namespace parts as `options.declared`:

```js
var declare = require('nsdeclare');

var options = {
  declared: {
    'MyApp': true
  }
};

var declaration = [
  declare('MyApp.Views', options),
  declare('MyApp.Templates', options),
  declare('MyApp.Models', options),
  declare('MyApp.Collections', options)
].join('\n');
```

Result:
```js
this["MyApp"]["Views"] = this["MyApp"]["Views"] || {};
this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};
this["MyApp"]["Models"] = this["MyApp"]["Models"] || {};
this["MyApp"]["Collections"] = this["MyApp"]["Collections"] || {};
```

Note that, if you don't pass `options.declared` and a namespace part is already declared, `nsdeclare` will not overwrite it.

### separator
Type: `String`

Default: `'\n'`

If you would like to separate declaration parts with something other than `\n`, you can pass it as `options.separator`:

```js
var declare = require('nsdeclare');

var declaration = declare('MyApp.Templates', { separator: '' });
```

Result:
```js
this["MyApp"] = this["MyApp"] || {};this["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};
```

### root
Type: `String`

Default: `'this'`

By default, `nsdeclare` will declare namespaces within the `this` object (which defaults to `window` in browser environments). You can change this behavior with `options.root`:

```js
var declare = require('nsdeclare');

var declaration = declare('MyApp.Templates', { root: 'global' });
```

Result:
```js
global["MyApp"] = global["MyApp"] || {};
global["MyApp"]["Templates"] = global["MyApp"]["Templates"] || {};
```

### response
Type: `String`  
Default: `declaration`

By default, `nsdeclare` will return the declaration as a string. In some cases, you might want additional details such as a safe reference to the namespace itself. Passing `response: 'details'` will cause `nsdeclare` to return an object with the following properties:

  * `namespace` - The namespace itself as a `String`
  * `declaration` - The declaration of the namespace as a `String`

```js
var declare = require('nsdeclare');

var declaration = declare('MyApp.Templates', { response: 'object' });
```

Result:
```js
{
  namespace: 'this["MyApp"]["Templates"]',
  declaration: 'this["MyApp"] = this["MyApp"] || {};\nthis["MyApp"]["Templates"] = this["MyApp"]["Templates"] || {};'
}
```

[travis]: http://travis-ci.org/lazd/nsdeclare
[travis-image]: https://secure.travis-ci.org/lazd/nsdeclare.png?branch=master

[npm-url]: https://npmjs.org/package/nsdeclare
[npm-image]: https://badge.fury.io/js/nsdeclare.png
