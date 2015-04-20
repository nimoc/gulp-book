# lnfs [![Build Status](http://img.shields.io/travis/kevva/lnfs.svg?style=flat)](https://travis-ci.org/kevva/lnfs)

> Safely force create symlinks

## Install

```sh
$ npm install --save lnfs
```

## Usage

```js
var symlink = require('lnfs');

symlink('foo.txt', 'bar.txt', function (err) {
	if (err) {
		throw err;
	}

	console.log('Symlink successfully created!');
});

symlink.sync('foo.txt', 'bar.txt');
```

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
