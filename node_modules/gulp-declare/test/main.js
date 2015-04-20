var declare = require('../');
var should = require('should');
var gutil = require('gulp-util');
var os = require('os');
var fs = require('fs');
var path = require('path');
require('mocha');

var getFixture = function(filePath) {
  filePath = path.join('test', 'fixtures', filePath);
  return new gutil.File({
    path: filePath,
    cwd: path.join('test', 'fixtures'),
    base: path.dirname(filePath),
    contents: fs.readFileSync(filePath)
  });
};

var getExpectedString = function(filePath) {
  return fs.readFileSync(path.join('test', 'expected', filePath), 'utf8');
};

var fileMatchesExpected = function(file, expectedFileName) {
  should.exist(file);
  should.exist(file.contents);
  file.contents.toString().should.equal(getExpectedString(expectedFileName));
};

describe('gulp-declare', function() {
  describe('declare()', function() {

    it('should declare based on filename by default', function(done) {
      var stream = declare();

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Templates.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Declaration based on filename.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should declare base namespaces', function(done) {
      var stream = declare({
        namespace: 'MyApp.Templates'
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Base namespace.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should assign as a property of a namespace', function(done) {
      var stream = declare({
        namespace: 'MyApp.Templates'
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.js'),
        contents: new Buffer('function() { return "App"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Assign as a property of a namespace.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should assign as a property of a sub-namespace', function(done) {
      var stream = declare({
        namespace: 'MyApp.Templates'
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "App"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Assign as a property of a subnamespace.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom processName functions', function(done) {
      var stream = declare({
        processName: function(name) {
          return 'x';
        }
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Custom processName function.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom processName functions with namespaces', function(done) {
      var stream = declare({
        namespace: 'App',
        processName: function(name) {
          return 'Main';
        }
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Custom processName with a namespace.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should correctly split based on path when using processNameByPath', function(done) {
      var stream = declare({
        namespace: 'App',
        processName: declare.processNameByPath
      });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('templates','Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'processNameByPath.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom separators', function(done) {
       var stream = declare({ separator: '' });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Templates.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Custom separator.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should support custom root', function(done) {
       var stream = declare({ root: 'global' });

      var fakeFile = new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Templates.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      });

      stream.on('data', function(newFile) {
        fileMatchesExpected(newFile, 'Custom root.js');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('should process multiple files', function(done) {
      var stream = declare({
        namespace: 'Namespace'
      });

      var count = 0;
      stream.on('data', function(newFile) {
        should.exist(newFile);
        newFile.contents.should.be.ok;
        count++;
      });

      stream.on('end', function() {
        count.should.equal(3);
        done();
      });

      stream.write(new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      }));

      stream.write(new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Header.js'),
        contents: new Buffer('function() { return "Header"; }')
      }));

      stream.write(new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Footer.js'),
        contents: new Buffer('function() { return "Footer"; }')
      }));

      stream.end();
    });

    it('should not re-declare namespace parts when noRedeclare: true', function(done) {
      var stream = declare({
        namespace: 'Namespace',
        noRedeclare: true
      });

      var finalString = '';
      stream.on('data', function(newFile) {
        should.exist(newFile);
        var contents = String(newFile.contents);
        finalString += contents+'\n';
      });

      stream.on('end', function() {
        var ns1matches = finalString.match(/this\["Namespace"\] = this\["Namespace"\] \|\| \{\};/g);
        var ns2matches = finalString.match(/this\["Namespace"\]\["App"\] = this\["Namespace"\]\["App"\] \|\| \{\};/g);
        should(ns1matches).be.ok;
        should(ns2matches).be.ok;
        ns1matches.length.should.equal(1);
        ns2matches.length.should.equal(1);
        done();
      });

      stream.write(new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Main.js'),
        contents: new Buffer('function() { return "Main"; }')
      }));

      stream.write(new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Header.js'),
        contents: new Buffer('function() { return "Header"; }')
      }));

      stream.write(new gutil.File({
        base: 'fixtures',
        path: path.join('fixtures','App.Footer.js'),
        contents: new Buffer('function() { return "Footer"; }')
      }));

      stream.end();
    });

  });
});
