var test = require('tape')
var jsdoc = require('../')

test('async', function(t){
  t.plan(1)
  jsdoc({ src: __dirname + '/fixture/class.js', explain: true }).then(data => {
    t.ok(data.length > 1)
  })
})
