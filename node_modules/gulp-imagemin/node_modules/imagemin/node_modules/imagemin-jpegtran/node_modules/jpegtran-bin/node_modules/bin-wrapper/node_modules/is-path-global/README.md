# is-path-global [![Build Status](http://img.shields.io/travis/kevva/is-path-global.svg?style=flat)](https://travis-ci.org/kevva/is-path-global)

> Check if a path is in PATH

## Install

```sh
$ npm install --save is-path-global
```

## Usage

```js
var isPathGlobal = require('is-path-global');

isPathGlobal('/bin/sh');
//=> true

isPathGlobal('/home/sirjohndoe');
//=> false
```

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
