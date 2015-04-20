var assert = require('assert')
  , from = require('./')

var random = ['hello', 'goodbye', 1, 2, 3]

var s = from(random, {decodeString: false, objectMode: true})

s.on('readable', function() {
  assert.equal(s.read(), random.shift())
})

var sentence = ('A modern version of dominictarr\'s from,' +
               'implemented with the new stream api.').split('')
  , characters = from(sentence)

var i = 0

characters.on('data', function(data) {
  assert.equal(data, sentence[i++])
})

assert(i)



