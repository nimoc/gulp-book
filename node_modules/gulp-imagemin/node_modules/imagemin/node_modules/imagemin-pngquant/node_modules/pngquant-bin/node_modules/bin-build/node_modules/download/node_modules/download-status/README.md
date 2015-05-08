# download-status [![Build Status](https://travis-ci.org/kevva/download-status.svg?branch=master)](https://travis-ci.org/kevva/download-status)

> Progress bar plugin for download

![](https://cloud.githubusercontent.com/assets/709159/4175732/534ac138-35e3-11e4-80a2-dea9a8af1fb5.png)

## Install

```bash
$ npm install --save download-status
```

## Usage

```js
var Download = require('download');
var progress = require('download-status');

var download = new Download({ extract: true, strip: 1 })
	.get('http://example.com/file.zip')
	.dest('dest')
	.use(progress());

download.run(function (err) {
	if (err) {
		throw err;
	}

	console.log('Download finished!');
});
```

## API

### progress(opts)

Pass in [options](https://github.com/tj/node-progress#options) to customize 
the look of the progress bar.

## License

MIT © [Kevin Mårtensson](http://kevinmartensson.com)
