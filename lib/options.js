var merge = require('lodash.merge')

var defaults = exports.defaults = {
  fps: 25,
  loop: 5,
  transition: true,
  transitionDuration: 1,
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4'
}

exports.define = function (options) {
  return merge({}, defaults, options)
}

exports.applyVideo = function (video, options) {
  Object.keys(options).forEach(function (key) {
    if (typeof video[key] === 'function') {
      video[key](options[key])
    }
  })
}
