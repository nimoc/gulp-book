# exec-series

[![Build Status](https://travis-ci.org/shinnn/exec-series.svg?branch=master)](https://travis-ci.org/shinnn/exec-series)
[![Build status](https://ci.appveyor.com/api/projects/status/bi4pflltlq5368ym?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/exec-series)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/exec-series.svg)](https://coveralls.io/r/shinnn/exec-series)
[![Dependency Status](https://david-dm.org/shinnn/exec-series.svg)](https://david-dm.org/shinnn/exec-series)
[![devDependency Status](https://david-dm.org/shinnn/exec-series/dev-status.svg)](https://david-dm.org/shinnn/exec-series#info=devDependencies)

A [Node](http://nodejs.org/) module to run commands in order

```javascript
var execSeries = require('exec-series');

execSeries(['echo "foo"', 'echo "bar"'], function(err, stdouts, stderrs) {
  if (err) {
    throw err;
  }

  console.log(stdouts); // yields: ['foo', 'bar']
  console.log(stderrs); // yields: ['', '']
});
```

On Linux, you can do almost the same thing with [`&&`](http://tldp.org/LDP/abs/html/list-cons.html#LISTCONSREF) operator like below:

```javascript
var exec = require('child_process').exec;

exec('echo "foo" && echo "bar"', function(err, stdout, stderr) {
  //...
});
```

However, some environments, such as [Windows PowerShell](https://connect.microsoft.com/PowerShell/feedback/details/778798/implement-the-and-operators-that-bash-has), don't support `&&` operator. This module helps you to create a [cross-platform Node program](https://gist.github.com/domenic/2790533).

## Installation

[![NPM version](https://badge.fury.io/js/exec-series.svg)](https://www.npmjs.org/package/exec-series)

[Use npm](https://www.npmjs.org/doc/cli/npm-install.html).

```
npm install exec-series
```

## API

```javascript
var execSeries = require('exec-series');
```

### execSeries(*commands* [, options, callback])

*commands*: `Array` of `String` (the commands to run)  
*options*: `Object` ([child_process.exec][exec] options)  
*callback*: `Function`

It sequentially runs the commands using [child_process.exec][exec]. If the first command has finished successfully, the second command will run, and so on.

When the last command has finished, it runs the callback function.

When one of the commands fails, it immediately calls the callback function and the rest of the commands won't run.

#### callback(error, stdoutArray, stderrArray)

*error*: `Error` if one of the commands fails, otherwise `undefined`  
*stdoutArray*: `Array` of `String` (stdout of the commands)  
*stderrArray*: `Array` of `String` (stderr of the commands)

```javascript
execSeries([
  'mkdir foo',
  'echo bar',
  'exit 200',
  'mkdir baz'
], function(err, stdouts, stderrs) {
  err.code; //=> 200
  stdouts; //=> ['', 'bar\n', '']
  stderrs; //=> ['', '', '']
  
  fs.existsSync('foo'); //=> true
  fs.existsSync('baz'); //=> false
});
```

Callback function is optional.

```javascript
execSeries(['mkdir foo', 'mkdir bar']);

setTimeout(function() {
  fs.existsSync('foo'); //=> true
  fs.existsSync('bar'); //=> true
}, 1000);
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[exec]: http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
