var through2 = require('through2');
var gutil = require('gulp-util');

const PLUGIN_NAME = 'gulp-handlebars';

module.exports = function(opts) {
  'use strict';

  opts = opts || {};
  var compilerOptions = opts.compilerOptions || {};
  var handlebars = opts.handlebars || require('handlebars');

  return through2.obj(function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    var contents = file.contents.toString();
    var compiled = null;
    try {
      var ast = handlebars.parse(contents);
      // Preprocess AST before compiling
      if (opts.processAST) {
        // processAST may return new AST or change it in place
        ast = opts.processAST(ast) || ast;
      }
      compiled = handlebars.precompile(ast, compilerOptions).toString();
    }
    catch (err) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, err, {
        fileName: file.path
      }));
      return callback();
    }

    file.contents = new Buffer(compiled);
    file.path = gutil.replaceExtension(file.path, '.js');

    // Options that take effect when used with gulp-define-module
    file.defineModuleOptions = {
      require: {
        Handlebars: 'handlebars'
      },
      context: {
        handlebars: 'Handlebars.template(<%= contents %>)'
      },
      wrapper: '<%= handlebars %>'
    };

    callback(null, file);
  });
};
