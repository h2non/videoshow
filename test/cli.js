var fs = require('fs')
var expect = require('chai').expect
var exec = require('child_process').exec

suite('command-line', function () {
  var output = 'test/.tmp/video.mp4'

  function clean() {
    fs.unlinkSync(output)
  })

  test('config', function (done) {
    var args = '--config test/fixtures/config.json --output ' + output

    exec('bin/videoshow ' + args,
    function (error, stdout, stderr) {
      expect(stdout).to.match(/video/i)
      expect(stderr).to.be.empty
      expect(fs.existsSync(output)).to.be.true
      clean()
      done()
    })
  })

  test('audio', function (done) {
    var args = '--config test/fixtures/config.json --audio test/fixtures/song.ogg ' + output

    exec('bin/videoshow ' + args,
    function (error, stdout, stderr) {
      expect(stdout).to.match(/video/i)
      expect(stderr).to.be.empty
      expect(fs.existsSync(output)).to.be.true
      clean()
      done()
    })
  })
})
