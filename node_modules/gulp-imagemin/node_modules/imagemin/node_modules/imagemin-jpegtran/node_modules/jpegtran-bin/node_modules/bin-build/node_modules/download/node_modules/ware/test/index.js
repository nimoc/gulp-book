
describe('ware', function () {

  var assert = require('assert');
  var noop = function(){};
  var ware = require('..');

  describe('#use', function () {
    it('should be chainable', function () {
      var w = ware();
      assert(w.use(noop) == w);
    });

    it('should add a middleware to fns', function () {
      var w = ware().use(noop);
      assert(1 == w.fns.length);
    });

    it('should accept an array of middleware', function () {
      var w = ware().use([noop, noop]);
      assert(2 == w.fns.length);
    });

    it('should accept a Ware instance', function () {
      var o = ware().use(noop).use(noop);
      var w = ware().use(o);
      assert(2 == w.fns.length);
    });

    it('should accept an array of Ware instances', function() {
      var a = ware().use(noop).use(noop);
      var b = ware().use(noop).use(noop);
      var w = ware([a, b]);
      assert(4 == w.fns.length);
    })

    it('should accept middleware on construct', function () {
      var w = ware(noop);
      assert(1 == w.fns.length);
    });
  });

  describe('#run', function () {
    describe('async', function() {
      it('should receive an error', function (done) {
        var error = new Error();
        ware()
          .use(function (next) { next(error); })
          .run(function (err) {
            assert(err == error);
            done();
          });
      });

      it('should receive initial arguments', function (done) {
        ware()
          .use(function (req, res, next) { next(); })
          .run('req', 'res', function (err, req, res) {
            assert(!err);
            assert('req' == req);
            assert('res' == res);
            done();
          });
      });

      it('should take any number of arguments', function (done) {
        ware()
          .use(function (a, b, c, next) { next(); })
          .run('a', 'b', 'c', function (err, a, b, c) {
            assert(!err);
            assert('a' == a);
            assert('b' == b);
            assert('c' == c);
            done();
          });
      });

      it('should let middleware manipulate the same input objects', function (done) {
        ware()
          .use(function (obj, next) {
            obj.value = obj.value * 2;
            next();
          })
          .use(function (obj, next) {
            obj.value = obj.value.toString();
            next();
          })
          .run({ value: 21 }, function (err, obj) {
            assert('42' == obj.value);
            done();
          });
      });

      it('should jump to done on error', function (done) {
        var errors = 0;
        ware()
          .use(function (next) { next(new Error()); })
          .use(function (next) { errors++; next(err); })
          .use(function (next) { errors++; next(err); })
          .run(function (err) {
            assert(err);
            assert(0 == errors);
            done();
          });
      });

      it('should not require a callback', function (done) {
        ware()
          .use(function (obj, next) { assert(obj); next(); })
          .use(function (obj, next) { done(); })
          .run('obj');
      });
    });

    describe('sync', function() {
      it('should receive an error', function (done) {
        var error = new Error();
        ware()
          .use(function () { return error; })
          .run(function (err) {
            assert(err == error);
            done();
          });
      });

      it('should catch an error', function (done) {
        var error = new Error();
        ware()
          .use(function () { throw error; })
          .run(function (err) {
            assert(err === error);
            done();
          });
      });

      it('should receive initial arguments', function (done) {
        ware()
          .use(function (req, res) { return; })
          .run('req', 'res', function (err, req, res) {
            assert(!err);
            assert('req' == req);
            assert('res' == res);
            done();
          });
      });

      it('should take any number of arguments', function (done) {
        ware()
          .use(function (a, b, c) { })
          .run('a', 'b', 'c', function (err, a, b, c) {
            assert(!err);
            assert('a' == a);
            assert('b' == b);
            assert('c' == c);
            done();
          });
      });

      it('should let middleware manipulate the same input objects', function (done) {
        ware()
          .use(function (obj) {
            obj.value = obj.value * 2;
          })
          .use(function (obj) {
            obj.value = obj.value.toString();
          })
          .run({ value: 21 }, function (err, obj) {
            assert(!err);
            assert('42' == obj.value);
            done();
          });
      });


      it('should skip middleware on error', function (done) {
        var errors = 0;
        ware()
          .use(function () { return new Error(); })
          .use(function (next) { errors++; next(err); })
          .use(function (next) { errors++; next(err); })
          .run(function (err) {
            assert(err);
            assert(0 == errors);
            done();
          });
      });

      it('should not require a callback', function (done) {
        ware()
          .use(function (obj) { assert(obj); })
          .use(function (obj) { done(); })
          .run('obj');
      });

      it('should support promises', function (done) {
        ware()
          .use(function () {
            return {
              then: function (resolve) { resolve(10); }
            };
          })
          .run(done);
      });

      it('should skip middleware on promise error', function (done) {
        var errors = 0;
        ware()
          .use(function () {
            return {
              then: function (resolve, reject) { reject(new Error()); }
            };
          })
          .use(function (next) { errors++; next(err); })
          .use(function (next) { errors++; next(err); })
          .run(function (err) {
            assert(err);
            assert(0 == errors);
            done();
          });
      });
    })

    describe('generator', function() {
      it('should receive an error', function (done) {
        var error = new Error();
        ware()
          .use(function *() { throw error; })
          .run(function (err) {
            assert(err == error);
            done();
          });
      });

      it('should receive initial arguments', function (done) {
        ware()
          .use(function *(req, res) { })
          .run('req', 'res', function (err, req, res) {
            assert(!err);
            assert('req' == req);
            assert('res' == res);
            done();
          });
      });

      it('should take any number of arguments', function (done) {
        ware()
          .use(function *(a, b, c) { })
          .run('a', 'b', 'c', function (err, a, b, c) {
            assert(!err);
            assert('a' == a);
            assert('b' == b);
            assert('c' == c);
            done();
          });
      });

      it('should let middleware manipulate the same input objects', function (done) {
        ware()
          .use(function *(obj) {
            obj.value = obj.value * 2;
          })
          .use(function *(obj) {
            obj.value = obj.value.toString();
          })
          .run({ value: 21 }, function (err, obj) {
            assert('42' == obj.value);
            done();
          });
      });

      it('should wait for the gen to finish', function(done) {
        ware()
          .use(function *(a, b, c) {
            yield wait(100);
          })
          .run('a', 'b', 'c', function (err, a, b, c) {
            assert(!err);
            assert('a' == a);
            assert('b' == b);
            assert('c' == c);
            done();
          });
      })

      it('should jump to done on error', function (done) {
        var errors = 0;
        ware()
          .use(function *() { throw new Error(); })
          .use(function *() { errors++; })
          .use(function *() { errors++; })
          .run(function (err) {
            assert(err);
            assert(0 == errors);
            done();
          });
      });

      it('should not require a callback', function (done) {
        ware()
          .use(function *(obj) { assert(obj); })
          .use(function *(obj) { done(); })
          .run('obj');
      });
    });
  });
});

function wait(ms) {
  return function(fn) {
    setTimeout(fn, ms);
  }
}
