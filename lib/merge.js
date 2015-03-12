var os = require('os')
var ffmpeg = require('fluent-ffmpeg')
var applyVideoOptions = require('./options').applyVideo

module.exports = merge

function merge(parts, output, options) {
  parts = parts.slice()
  var video = ffmpeg(parts.shift())

  parts.forEach(function (part) {
    video.input(part)
  })

  if (options) {
    applyVideoOptions(video, options)
  }

  video.mergeToFile(output, os.tmpdir())

  return video
}
