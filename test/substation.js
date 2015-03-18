var expect = require('chai').expect
var substation = require('../lib/substation')

suite('substation', function () {
  suite('stringify', function () {
    test('single', function () {
      var subtitle = {
        id: 1,
        startTime: 1000,
        endTime: 3000,
        text: 'Hello World'
      }

      var params = {
        Fontname: 'Verdana',
        Fontsize: '28',
        PrimaryColour: '11861244'
      }

      var lines = substation.stringify([ subtitle ], params).split('\n')
      lines.pop()

      expect(lines.shift()).to.be.equal('[Script Info]')
      expect(lines.shift()).to.be.equal('Title: Videoshow video')
      expect(lines.shift()).to.be.equal('ScriptType: v4')
      expect(lines.pop()).to.be.equal('Dialogue: Marked=0,0:00:01.00,0:00:03.00,DefaultVCD,NTP,0000,0000,0000,,Hello World')
      expect(lines.pop()).to.be.equal('Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text')
    })
  })
})
