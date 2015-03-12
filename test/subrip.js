var expect = require('chai').expect
var subrip = require('../lib/subrip')

suite('subrip', function () {
  suite('stringify', function () {
    test('single', function () {
      var subtitle = {
        id: 1,
        startTime: 1000,
        endTime: 3000,
        text: 'Hello World'
      }

      var lines = subrip.stringify([ subtitle ]).split('\n')
      expect(lines.shift()).to.be.equal('1')
      expect(lines.shift()).to.be.equal('00:00:01,000 --> 00:00:03,000')
      expect(lines.shift()).to.be.equal('Hello World')
    })

    test('multiline', function () {
      var subtitles = [{
        id: 1,
        startTime: 1000,
        endTime: 3000,
        text: 'Hello World'
      }, {
        id: 2,
        startTime: 2000,
        endTime: 5000,
        text: 'Hello World'
      }]

      var lines = subrip.stringify(subtitles).split('\n')
      expect(lines.shift()).to.be.equal('1')
      expect(lines.shift()).to.be.equal('00:00:01,000 --> 00:00:03,000')
      expect(lines.shift()).to.be.equal('Hello World')

      lines.shift()

      expect(lines.shift()).to.be.equal('2')
      expect(lines.shift()).to.be.equal('00:00:02,000 --> 00:00:05,000')
      expect(lines.shift()).to.be.equal('Hello World')
    })
  })
})
