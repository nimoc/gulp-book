module.exports = function(ns, options) {
  var declared = options && options.declared;
  var separator = options && options.separator !== undefined ? options.separator : '\n';
  var curPath = options && options.root || 'this'; // Don't support empty roots
  var value = options && options.value;
  var response = options && options.response === 'details' ? options.response : 'declaration'; // format

  var doAssignment = value !== undefined;
  var output = [];

  if (ns !== curPath) {
    var nsParts = ns.split('.');
    nsParts.some(function(curPart, index) {
      if (curPart !== 'this') {
        curPath += '[' + JSON.stringify(curPart) + ']';

        // Ignore the last part of the namespace, it will be used for assignment
        if (doAssignment && index === nsParts.length - 1) {
          return true;
        }
        else {
          // Avoid redeclaring parts of the namespace
          if (!declared || !declared[curPath]) {
            output.push(curPath + ' = ' + curPath + ' || {};');
          }

          // Store parts of the namespace that have been declared
          if (declared) {
            declared[curPath] = true;
          }
        }
      }
    });
  }

  // Assign the provided value at the end of the namespace
  if (doAssignment) {
  	output.push(curPath+' = '+value+';');
  }

  var finalOutput = output.join(separator);

  return response === 'details' ? {
    namespace: curPath,
    declaration: finalOutput
  } : finalOutput;
};
