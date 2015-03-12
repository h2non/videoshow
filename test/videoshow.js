var fs = require('fs')
var rm = require('rimraf')
var expect = require('chai').expect
var videoshow = require('../')
var TMP = 'test/.tmp'

suite('videoshow', function () {
  var images = [
    'test/fixtures/step_1.png',
    'test/fixtures/step_2.png',
    'test/fixtures/step_3.png',
    'test/fixtures/step_4.png',
    'test/fixtures/step_5.png'
  ]

  before(function () {
    rm.sync(TMP)
  })

  before(function () {
    fs.mkdirSync(TMP)
  })

  test('create video with images', function (done) {
    videoshow(images)
      .save(TMP + '/test.mp4')
      .on('error', done)
      .on('end', function (output) {
        expect(fs.existsSync(output)).to.be.true
        done()
      })
  })

  test('create video with audio', function (done) {
    videoshow(images)
      .audio(__dirname + '/fixtures/song.aac')
      .save(TMP + '/test2.mp4')
      .on('error', done)
      .on('end', function (output) {
        expect(fs.existsSync(output)).to.be.true
        done()
      })
  })

  test('create video with subtitles', function (done) {
    videoshow(images)
      .audio(__dirname + '/fixtures/song.aac')
      .subtitles(__dirname + '/fixtures/subtitles.srt')
      .save(TMP + '/test3.mp4')
      .on('error', done)
      .on('end', function (output) {
        expect(fs.existsSync(output)).to.be.true
        done()
      })
  })

  test('create video with custom captions per images', function (done) {
    var imgs = images.map(function (path) {
      return {
        path: path,
        caption: 'This is a sample subtitle text',
        loop: 3
      }
    })

    videoshow(imgs)
      .audio(__dirname + '/fixtures/song.aac')
      .subtitles(__dirname + '/fixtures/subtitles.srt')
      .save(TMP + '/test6.mp4')
      .on('error', done)
      .on('end', function (output) {
        expect(fs.existsSync(output)).to.be.true
        done()
      })
  })

  test('create video with mp3 audio', function (done) {
    videoshow(images)
      .audio(__dirname + '/fixtures/song.mp3')
      .save(TMP + '/test4.mp4')
      .on('error', done)
      .on('end', function (output) {
        expect(fs.existsSync(output)).to.be.true
        done()
      })
  })

  test('create video with ogg audio', function (done) {
    videoshow(images)
      .audio(__dirname + '/fixtures/song.ogg')
      .save(TMP + '/test5.mp4')
      .on('error', done)
      .on('end', function (output) {
        expect(fs.existsSync(output)).to.be.true
        done()
      })
  })
})
