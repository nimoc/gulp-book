var map = require('vinyl-map');
var path = require('path');
var extend = require('xtend');
var declare = require('nsdeclare');

// Default name processing function should give the filename without extension
var defaultProcessName = function(name) { return path.basename(name, path.extname(name)); };

var processNameByPath = function(filePath) {
  // Make the directory relative
  filePath = path.relative(process.cwd(), filePath);

  // Split the path into its components based on the separator
  var parts = filePath.split(path.sep);

  // Remove and process template name
  var templateName = path.basename(parts.pop(), '.js');

  // Add template name back
  parts.push(templateName);

  // Turn the path into dot notation
  return parts.join('.');
};

module.exports = function(options) {
  options = extend({
    processName: defaultProcessName,
    namespace: 'this',
    separator: '\n',
    root: 'this',
    noRedeclare: false
  }, options);

  // Support removal of duplicate declarations
  var alreadyDeclared = null;
  if (options.noRedeclare) {
    alreadyDeclared = {};
  }

  var declareNamespace = function(contents, filename) {
    contents = contents.toString();

    // Get the name of the template
    var name = options.processName(filename);

    // Prepend namespace to name
    if (options.namespace !== 'this') {
      name = options.namespace+'.'+name;
    }

    // Get namespace information for the final template name
    return declare(name, {
      declared: alreadyDeclared,
      value: contents,
      separator: options.separator,
      root: options.root
    });
  };

  return map(declareNamespace);
};

module.exports.processNameByPath = processNameByPath;
