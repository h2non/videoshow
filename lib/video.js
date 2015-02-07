var ffmpeg = require('fluent-ffmpeg')
var options = require('./options')

module.exports = video

function video(image, params, output) {
  var video = ffmpeg(image.path || image)
  params = options(params)

  Object.keys(params).forEach(function (key) {
    if (typeof video[key] === 'function') {
      video[key](params[key])
    }
  })

  if (typeof image === 'object') {
    if (image.filter || image.filters) {
      video.videoFilters(image.filter || image.filters)
    }
  }

  video.save(output)

  return video
}
