# url-regex [![Build Status](http://img.shields.io/travis/kevva/url-regex.svg?style=flat)](https://travis-ci.org/kevva/url-regex)

> Regular expression for matching URLs

Based on this [gist](https://gist.github.com/dperini/729294) by Diego Perini.

## Install

```sh
$ npm install --save url-regex
```

## Usage

```js
var urlRegex = require('url-regex');

urlRegex().test('github.com foo bar');
//=> true

urlRegex({exact: true}).test('github.com foo bar');
//=> false

urlRegex({exact: true}).test('github.com');
//=> true

'foo github.com bar google.com'.match(urlRegex());
//=> ['github.com', 'google.com']
```

## License

MIT © [Diego Perini](https://github.com/dperini)
