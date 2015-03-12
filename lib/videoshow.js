var union = require('lodash.merge')
var render = require('./render')
var options = require('./options')

module.exports = Videoshow

function Videoshow(images, params) {
  this.params = params || {}
  this.images = mapImages(images || [])
  this.videoParams = videoParams()
}

Videoshow.prototype.image = function (image) {
  this.images.push(mapImages(images))
  return this
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

Videoshow.prototype.audioFilter = function (filter) {
  this.videoParams.audioFilters.push(filter)
  return this
}

Videoshow.prototype.imageOptions = function (params) {
  union(this.videoParams, params)
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
  this.output = output
  return render(this)
}

function videoParams() {
  return {
    videoFilters: [],
    audioFilters: [],
    outputOptions: []
  }
}

function mapImages(obj) {
  if (typeof obj === 'string') {
    obj = { path: obj }
  }
  else if (Array.isArray(obj)) {
    obj = obj.map(mapImages)
  }
  return obj
}
