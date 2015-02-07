var os = require('os')
var ffmpeg = require('fluent-ffmpeg')

module.exports = merge

function merge(parts, output, options) {
  parts = parts.slice()
  var video = ffmpeg(parts.shift())

  parts.forEach(function (part) {
    video.input(part)
  })

  if (options) {
    Object.keys(options).forEach(function (key) {
      if (typeof video[key] === 'function') {
        video[key](options[key])
      }
    })
  }

  video.mergeToFile(output, os.tmpdir())

  return video
}
