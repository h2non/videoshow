var union = require('lodash.merge')
var save = require('./save')

module.exports = Videoshow

function Videoshow(images, params) {
  this.images = images || []
  this.params = params || {}
  this.videoParams = videoParams()
}

Videoshow.prototype.audio = function (path) {
  this.audioFile = path
  return this
}

Videoshow.prototype.subtitles = function (path) {
  this.subtitlesPath = path
  return this
}

Videoshow.prototype.filter = function (filter) {
  this.videoParams.videoFilters.push(filter)
  return this
}

Videoshow.prototype.imageOptions = function (params) {
  union(this.imageOptions, params)
  return this
}

Videoshow.prototype.options = function (options) {
  union(this.videoParams, options)
  return this
}

Videoshow.prototype.flag = function (flag) {
  this.videoParams.outputOptions.push(flag)
  return this
}

Videoshow.prototype.save = function (output) {
  return save(this, output)
}

function videoParams() {
  return {
    videoFilters: [],
    outputOptions: []
  }
}
