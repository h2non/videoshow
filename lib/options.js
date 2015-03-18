var merge = require('lodash.merge')

var defaults = exports.defaults = {
  fps: 25,
  loop: 5,
  transition: true,
  captionDelay: 1000,
  transitionDuration: 1,
  transitionColor: 'black',
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  useSubripSubtitles: false,
  subtitleStyle: null
}

exports.define = function (options) {
  return merge({}, defaults, options)
}

exports.applyVideo = function (video, options) {
  Object.keys(options).forEach(function (key) {
    var method = video[key]
    var arg = options[key]

    if (typeof method === 'function') {
      method = method.bind(video)
      if (arg === true) {
        method()
      } else if (Array.isArray(arg)) {
        if (arg.length) {
          method(arg)
        }
      } else if (arg != null) {
        method(arg)
      }
    }
  })
}
