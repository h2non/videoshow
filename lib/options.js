var merge = require('lodash.merge')

var defaults = {
  fps: 25,
  loop: 5,
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4'
}

exports = module.exports = function (options) {
  return merge({}, defaults, options)
}

exports.defaults = defaults
