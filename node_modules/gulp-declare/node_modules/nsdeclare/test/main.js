var nsdeclare = require('../');
var should = require('should');
var fs = require('fs');
var path = require('path');
require('mocha');

function getExpectedString(filePath) {
  return fs.readFileSync(path.join('test', 'expected', filePath), 'utf8');
}

function equalsExpected(string, filePath) {
  string.should.equal(getExpectedString(filePath));
}

describe('nsdeclare()', function() {
  it('should declare namespace parts', function() {
    var declaration = nsdeclare('MyApp.Templates.Final');

    equalsExpected(declaration, 'Basic declaration.js');
  });

  it('should assign properties if value passed', function() {
    var declaration = nsdeclare('MyApp.Templates.Final', { value: 'function() { return "Template"; }' });

    equalsExpected(declaration, 'Assignment.js');
  });

  it('should not re-declare namespace parts when called multiple times with an object', function() {
    var options = { declared: {} };
    var declaration = [
      nsdeclare('MyApp.Templates.One', options),
      nsdeclare('MyApp.Templates.Two', options),
      nsdeclare('MyApp.Templates.Two.One', options),
      nsdeclare('MyApp.Templates.Two.Two', options)
    ].join('\n');

    equalsExpected(declaration, 'Efficient declarations.js');
  });

  it('should use provided separator', function() {
    var declaration = nsdeclare('MyApp.Templates.Final', { separator: '' });
    equalsExpected(declaration, 'Custom separator.js');
  });

  it('should use provided root', function() {
    var declaration = nsdeclare('MyApp.Templates.Final', { root: 'global' });
    equalsExpected(declaration, 'Custom root.js');
  });

  it('should do nothing if namespace equals root', function() {
    nsdeclare('global', { root: 'global' }).should.equal('');
  });

  it('should return just the declaration by default', function () {
    // same test as first test
    var declaration = nsdeclare('MyApp.Templates.Final');

    equalsExpected(declaration, 'Basic declaration.js');
  });

  it('should return an object', function () {
    // same test as first test
    var declaration = nsdeclare('MyApp.Templates.Final', { response: 'details'});

    declaration.should.be.an.object;
    declaration.should.have.property('namespace', 'this["MyApp"]["Templates"]["Final"]');
    declaration.should.have.property('declaration');
    equalsExpected(declaration.declaration, 'Basic declaration.js');
  });

  it('should return the declaration if for invalid response', function () {
    // same test as first test
    var declaration = nsdeclare('MyApp.Templates.Final', { response: 'foo'});
    equalsExpected(declaration, 'Basic declaration.js');
  });

});
