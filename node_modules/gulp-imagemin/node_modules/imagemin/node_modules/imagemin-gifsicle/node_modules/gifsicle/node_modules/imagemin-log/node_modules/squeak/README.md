# squeak [![Build Status](http://img.shields.io/travis/kevva/squeak.svg?style=flat)](https://travis-ci.org/kevva/squeak)

> A tiny stream log

![](https://cloud.githubusercontent.com/assets/709159/5165451/f0ca124e-73e4-11e4-8a49-9e278b7aff16.png)

## Install

```sh
$ npm install --save squeak
```

## Usage

```js
var Squeak = require('squeak');
var log = new Squeak()
	.type('info')
	.type('success', { color: 'green' })
	.type('warn', { color: 'yellow' })
	.type('error', { color: 'red' }, function () {
		log.end();
		process.exit(1);
	});

log.info('this is a info message');
log.success('this is a success message');
log.warn('this is a warning');
log.error(new Error('this is an error').stack);

/*
     info : this is a info message
  success : this is a success message
     warn : this is a warning
    error : this is an error
    at ChildProcess.exithandler (child_process.js:648:15)
    at ChildProcess.emit (events.js:98:17)
 */
```

You can also customize the different types to use a custom prefix using the 
`prefix` option:

```js
var Squeak = require('squeak');
var log = new Squeak({ separator: ' ' })
	.type('success', { color: 'green', prefix: '✔' })
	.type('warn', { color: 'yellow', prefix: '⚠' });

log.success('this is a success message');
log.warn('this is a warning');

/*
  ✔ this is a success message
  ⚠ this is a warning
 */
```

## API

### new Squeak(options)

Type: `Object`

Creates a new `Squeak` instance with [options](#options-1).

### .write(args)

Writes to `options.stream`, using `process.stderr` by default.

### .writeln(args)

Same as `.write()` but with a new line.

### .writelpad(args)

Same as `.write()` but with padding.

### .type(type, options, callback)

Adds a type.

#### type

Type: `String`

The name of the type. Will be used as `prefix` by default.

#### options

Type: `Object`

Customize your type with a `color` and a `prefix`.

* `color`: Sets the prefix color. Supported colors can be found [here](https://github.com/sindresorhus/ansi-styles#colors).
* `prefix`: Sets the `type` prefix. Uses `type` by default.

#### callback

Type: `Function`

An optional callback to be called when the `type` is called.

### .emit(event, data)

Emits an event.

### .end(callback)

Type: `Function`

Writes a newline and executes an optional callback function.

## Options

### indent

Type: `Number`  
Default: `2`

Sets the indentation.

### separator

Type: `String`  
Default: `  :  `

Customize the separator between the `prefix` and the message.

### stream

Type: `Stream`  
Default: `process.stderr`

Which `stream` to write to.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
