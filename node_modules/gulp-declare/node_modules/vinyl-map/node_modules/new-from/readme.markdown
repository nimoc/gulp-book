# new-from

A modern version of dominictarr's from, implemented with the new stream api. 

## API:

```javascript
var from = require('new-from')

var zero_to_nine = from(make_chunk)

function make_chunk(idx) {
  if(idx < 10) {
    return idx
  }  
  return null
}

// Or, in this case:

zero_to_nine = from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
```
