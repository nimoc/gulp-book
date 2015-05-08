# archive-type [![Build Status](http://img.shields.io/travis/kevva/archive-type.svg?style=flat)](https://travis-ci.org/kevva/archive-type)

> Detect the archive type of a Buffer/Uint8Array


## Install

```
$ npm install --save archive-type
```


## Usage

```js
var read = require('fs').readFileSync;
var archiveType = require('archive-type');

archiveType(read('foo.zip'));
//=> {ext: 'zip', mime: 'application/zip'}
```


## API

### archiveType(buf)

Returns [`7z`](https://github.com/kevva/is-7zip), [`bz2`](https://github.com/kevva/is-bzip2), [`gz`](https://github.com/kevva/is-gzip), [`rar`](https://github.com/kevva/is-rar), [`tar`](https://github.com/kevva/is-tar), [`zip`](https://github.com/kevva/is-zip) or `false`.

#### buf

Type: `buffer` *(Node.js)*, `uint8array`

It only needs the first 261 bytes.


## CLI

```
$ npm install --global archive-type
```

```
$ archive-type --help

  Usage
    $ archive-type <file>
    $ cat <file> | archive-type

  Example
    $ archive-type foo.tar.gz
    $ cat foo.tar.gz | archive-type
```


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
