var ffmpeg = require('fluent-ffmpeg')
var Videoshow = require('./videoshow')
var pkg = require('../package.json')

module.exports = videoshow

function videoshow(images, options) {
  return new Videoshow(images, options)
}

videoshow.VERSION = pkg.version
videoshow.ffmpeg = ffmpeg
