var expect = require('chai').expect
var substation = require('../lib/substation')

suite('substation', function () {
  suite('stringify', function () {
    test('single', function () {
      var subtitles = [
        {
          id: 1,
          startTime: 1000,
          endTime: 3000,
          text: 'Hello World'
        },
        {
          id: 2,
          startTime: 4123,
          endTime: 5555,
          text: 'Hello World 2'
        }
      ]

      var params = {
        Fontname: 'Verdana',
        Fontsize: '28',
        PrimaryColour: '11861244'
      }

      var lines = substation.stringify(subtitles, params).split('\n')
      lines.pop()

      expect(lines.shift()).to.be.equal('[Script Info]')
      expect(lines.shift()).to.be.equal('Title: Videoshow video')
      expect(lines.shift()).to.be.equal('ScriptType: v4')
      expect(lines.pop()).to.be.equal('Dialogue: Marked=0,0:00:04.12,0:00:05.55,DefaultVCD,NTP,0000,0000,0000,,Hello World 2')
      expect(lines.pop()).to.be.equal('Dialogue: Marked=0,0:00:01.00,0:00:03.00,DefaultVCD,NTP,0000,0000,0000,,Hello World')
      expect(lines.pop()).to.be.equal('Format: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text')
    })
  })
})
