# bin-check [![Build Status](https://travis-ci.org/kevva/bin-check.svg?branch=master)](https://travis-ci.org/kevva/bin-check)

> Check if a binary is working by checking its exit code

## Install

```sh
$ npm install --save bin-check
```

## Usage

```js
var binCheck = require('bin-check');

binCheck('/bin/sh', ['--version'], function (err, works) {
    if (err) {
        throw err;
    }

    console.log(works);
    // => true
});
```

## API

### binCheck(bin, cmd, cb)

Check if a binary is working by checking its exit code. Use `cmd` to test against
custom commands. Defaults to `--help`.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
